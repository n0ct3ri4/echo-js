const { existsSync, PathLike, readdirSync } = require("fs");
require("colors");

module.exports = class {
  /**
   * Check the "Systems Identifiers" file.
   * @param {PathLike} ids 'Systems Identifiers' file.
   */
  check(ids) {
    return new Promise((resolve, reject) => {
      if (existsSync(ids)) {
        if (ids.endsWith(".json")) {
          resolve({
            msg: "'Systems Identifiers' file is correctly installed.",
          });
        } else {
          reject(
            new Error("'Systems Identifiers' file should be writed in JSON.")
          );
        }
      } else {
        reject(new Error("'Systems Identifiers' file doesn't exists."));
      }
    });
  }

  /**
   * Start a system via its boot-id.
   * @param {string} id System Identifier
   */
  boot(id) {
    return new Promise((resolve, reject) => {
      if (require("../systems/identifiers.json") !== (undefined || null)) {
        require("../systems/identifiers.json").forEach((sys) => {
          if (sys.id == id) {
            if (sys.entry !== ("" || null || undefined)) {
              if (
                require(`../systems/${sys.id}/${sys.entry}`).__init !==
                  (undefined || null) ||
                typeof require(`../systems/${sys.id}/${sys.entry}`).__init ==
                  "function"
              ) {
                resolve("Done!");
                try {
                  console.log("Installing dependencies...");
                  console.log(
                    require("child_process").execSync(
                      `npm i ${sys.dependencies.join(" ")}`,
                      { encoding: "utf-8" }
                    )
                  );
                } catch (err) {
                  if (err) throw new Error(err);
                } finally {
                  console.log("Launching...");
                  require(`../systems/${sys.id}/${sys.entry}`).__init();
                }
              } else {
                reject(
                  new Error(
                    'This system configuration doesn\'t contains an initialization method. ("__init()")'
                  )
                );
              }
            } else {
              reject(
                new Error(
                  "This system configuration doesn't contains an entry file."
                )
              );
            }
          } else {
            reject(
              new Error(
                "This system configuration doesn't contains the specified boot-identifier."
              )
            );
          }
        });
      } else {
        reject(new Error("'Systems Identifiers' file doesn't exists."));
      }
    });
  }
};
