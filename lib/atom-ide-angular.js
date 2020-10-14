const { AutoLanguageClient } = require("atom-languageclient");

class AngularLanguageClient extends AutoLanguageClient {
  getGrammarScopes() {
    return ["source.ts", "source.tsx", "text.html.ng", "text.html"];
  }
  getLanguageName() {
    return "Angular";
  }
  getServerName() {
    return "Angular Language Server";
  }

  startServerProcess() {
    const server = require.resolve("@angular/language-server");
    const alsSearchPaths = [];
    const tsSearchPaths = [];
    // try to load @angular/language-service and typescript
    // from project first
    const dirs = atom.project.getDirectories();
    let modulesdir = dirs.find((x) =>
      x
        .getSubdirectory("node_modules")
        .getSubdirectory("@angular")
        .getSubdirectory("language-service")
        .existsSync()
    );
    if (modulesdir) {
      alsSearchPaths.push(modulesdir.getRealPathSync());
      tsSearchPaths.push(modulesdir.getRealPathSync());
    }
    alsSearchPaths.push(require.resolve("@angular/language-service"));
    tsSearchPaths.push(require.resolve("typescript"));
    return super.spawnChildNode([
      server,
      "--ngProbeLocations",
      alsSearchPaths.join(","),
      "--tsProbeLocations",
      tsSearchPaths.join(","),
      "--stdio",
      "--logVerbosity",
      "debug",
    ]);
  }
}

module.exports = new AngularLanguageClient();
