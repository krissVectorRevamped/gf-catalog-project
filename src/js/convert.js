import fs from 'fs/promises';

async function convert() {
  const inputPath  = './src/json/tdoll_data.json';   // path to your existing file
  const outputPath = './characters.json';            // output path for flat JSON

  try {
    const raw = await fs.readFile(inputPath, 'utf-8');
    const data = JSON.parse(raw);

    if (!Array.isArray(data.tdolls)) {
      console.error("Input JSON does not have a tdolls array");
      return;
    }

    const flat = {};
    data.tdolls.forEach((c) => {
      const id = c.index != null ? c.index.toString() : Date.now().toString();
      flat[id] = {
        id,
        ...c
      };
    });

    await fs.writeFile(outputPath, JSON.stringify(flat, null, 2), 'utf-8');
    console.log(`Converted ${data.tdolls.length} entries → ${outputPath}`);
  } catch (err) {
    console.error("Error converting JSON:", err);
  }
}

convert();
