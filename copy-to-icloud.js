import chokidar from "chokidar";
import { exec } from "child_process";

chokidar.watch("clockify.js").on("change", (path) => {
  console.log(`file changed: ${path}`);
  exec(
    "cp clockify.js ~/Library/Mobile\\ Documents/iCloud\\~dk\\~simonbs\\~Scriptable/Documents/clockify.js",
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`clockify.js copied to iCloud`);
    }
  );
});
