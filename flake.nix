{
  description = "tree-sitter implementation for clausewizt engine scripts";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils, ...  } @ inputs:
    let
      inherit (nixpkgs) lib;
      eachDefaultSystem = f: utils.lib.eachDefaultSystem
        (system: f system (import nixpkgs { inherit system; }));
    in
    (eachDefaultSystem (system: pkgs: {
      devShells.default = pkgs.mkShell {
        buildInputs = lib.attrValues {
          inherit (pkgs) stdenv tree-sitter nodejs-slim graphviz;
        };
      };
    }));
}
