import { leTrucPlugin } from "@zeix/cem-plugin-le-truc";

let typeChecker;

export default {
  globs: ["src/**/*.ts"],
  exclude: ["**/*.test.ts", "**/*.stories.ts"],
  overrideModuleCreation({ ts, globs }) {
    const program = ts.createProgram(globs, { strict: true });
    typeChecker = program.getTypeChecker();
    return program.getSourceFiles().filter((sf) => !sf.isDeclarationFile);
  },
  plugins: [leTrucPlugin(() => typeChecker)],
};
