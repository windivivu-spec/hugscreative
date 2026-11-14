// Convert the user-selected PNGs in this folder into small square cube textures.
import sharp from "sharp";
import { readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const directory = new URL("../public/media/previews/loading/", import.meta.url);
const files = (await readdir(directory)).filter((name) => /\.png$/i.test(name));
for (const file of files) {
  const output =
    file
      .replace(/\.png$/i, "")
      .replace(/\s+/g, "-")
      .toLowerCase() + ".webp";
  await sharp(fileURLToPath(new URL(encodeURIComponent(file), directory)))
    .rotate()
    .resize(512, 512, { fit: "cover" })
    .webp({ quality: 82 })
    .toFile(fileURLToPath(new URL(output, directory)));
  console.log(`${file} → ${output}`);
}
