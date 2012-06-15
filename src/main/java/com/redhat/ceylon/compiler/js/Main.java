package com.redhat.ceylon.compiler.js;

import java.io.File;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.redhat.ceylon.cmr.api.RepositoryManager;
import com.redhat.ceylon.cmr.impl.JULLogger;
import com.redhat.ceylon.compiler.Options;
import com.redhat.ceylon.compiler.typechecker.TypeChecker;
import com.redhat.ceylon.compiler.typechecker.TypeCheckerBuilder;
import com.redhat.ceylon.compiler.typechecker.io.VirtualFile;

/**
 * Entry point for the type checker
 * Pass the source diretory as parameter. The source directory is relative to
 * the startup directory.
 *
 * @author Gavin King <gavin@hibernate.org>
 * @author Emmanuel Bernard <emmanuel@hibernate.org>
 */
public class Main {

    /** Print a help message with the available options. */
    private static void help() {
        System.err.println("Usage ceylonjs [options] [file|dir]...");
        System.err.println();
        System.err.println("Options:");
        System.err.println("  -rep <url>         Module repository (default: ./modules).");
        System.err.println("                     Can be specified multiple times.");
        System.err.println("  -user <value>      User name for output repository (HTTP only)");
        System.err.println("  -pass <value>      Password for output repository (HTTP only)");
        System.err.println("  -src <directory>   Path to source files (default: ./source)");
        System.err.println("  -out <url>         Output module repository (default: ./modules)");
        System.err.println("  -version           Version information");
        System.err.println("  -help              Print a synopsis of standard options");
        System.err.println();
        System.err.println("Javascript code generation options:");
        System.err.println("  -optimize    Create prototype-style JS code");
        System.err.println("  -nomodule    Do NOT wrap generated code as CommonJS module");
        System.err.println("  -noindent    Do NOT indent code");
        System.err.println("  -nocomments  Do not generate any comments");
        System.err.println("  -compact     Same as -noindent -nocomments");
        System.err.println("  -verbose     Print messages while compiling");
        System.err.println("  -profile     Time the compilation phases (results are printed to STDERR)");
        System.err.println();
        System.err.println("If no files are specified or '--' is used, STDIN is read.");
    }

    /**
     * Files that are not under a proper module structure are placed under a <nomodule> module.
     */
    public static void main(String[] _args) throws Exception {
        long t0, t1, t2, t3, t4;
        List<String> args = new ArrayList<String>(Arrays.asList(_args));
        final Options opts = Options.parse(args);
        if (opts.isVersion()) {
            System.err.println("Ceylon to Javascript Compiler version 0.3");
            return;
        }
        if (opts.isHelp()) {
            help();
            return;
        }
        if (args.size() == 0) {
            System.out.println("ceylonjs: no source files");
            System.out.println("Usage: ceylonjs <options> <source files>");
            System.out.println("use -help for a list of possible options");
            return;
        }

        final TypeChecker typeChecker;
        final RepositoryManager repoman = com.redhat.ceylon.compiler.java.util.Util.makeRepositoryManager(
                opts.getRepos(), opts.getOutDir(), new JULLogger());
        if (opts.isStdin()) {
            VirtualFile src = new VirtualFile() {
                @Override
                public boolean isFolder() {
                    return false;
                }
                @Override
                public String getName() {
                    return "SCRIPT.ceylon";
                }
                @Override
                public String getPath() {
                    return getName();
                }
                @Override
                public InputStream getInputStream() {
                    return System.in;
                }
                @Override
                public List<VirtualFile> getChildren() {
                    return new ArrayList<VirtualFile>(0);
                }
                @Override
                public int hashCode() {
                    return getPath().hashCode();
                }
                @Override
                public boolean equals(Object obj) {
                    if (obj instanceof VirtualFile) {
                        return ((VirtualFile) obj).getPath().equals(getPath());
                    }
                    else {
                        return super.equals(obj);
                    }
                }
            };
            t0 = System.nanoTime();
            TypeCheckerBuilder tcb = new TypeCheckerBuilder()
                .verbose(opts.isVerbose())
                .addSrcDirectory(src);
            tcb.setRepositoryManager(repoman);
            typeChecker = tcb.getTypeChecker();
            t1=System.nanoTime();
        } else {
            t0=System.nanoTime();
            TypeCheckerBuilder tcb = new TypeCheckerBuilder()
                .verbose(opts.isVerbose());
            tcb.setRepositoryManager(repoman);
            final File root = new File(opts.getSrcDir());
            final String path = root.getAbsolutePath();
            for (String filedir : args) {
                File f = new File(filedir);
                if (f.getAbsolutePath().startsWith(path)) {
                    tcb.addSrcDirectory(f);
                } else {
                    System.err.printf("%s is not in the current source path: [%s]%n", f.getAbsolutePath(), root);
                }
            }
            typeChecker = tcb.getTypeChecker();
            t1=System.nanoTime();
        }
        //getting the type checker does process all types in the source directory
        typeChecker.process();
        t2=System.nanoTime();
        JsCompiler jsc = new JsCompiler(typeChecker, opts);
        t3=System.nanoTime();
        if (!jsc.generate()) {
            jsc.printErrors(System.out);
        }
        t4=System.nanoTime();
        if (opts.isProfile() || opts.isVerbose()) {
            System.err.println("PROFILING INFORMATION");
            System.err.printf("TypeChecker creation:   %6d nanos%n", t1-t0);
            System.err.printf("TypeChecker processing: %6d nanos%n", t2-t1);
            System.err.printf("JS compiler creation:   %6d nanos%n", t3-t2);
            System.err.printf("JS compilation:         %6d nanos%n", t4-t3);
        }
        System.out.println("Compilation finished.");
    }
}