const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const logoPath = path.join(__dirname, "../public/images/pro-mata-logo.png");
const iconsDir = path.join(__dirname, "../public/icons");
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Verificar se o logo existe
if (!fs.existsSync(logoPath)) {
  console.error("❌ Logo não encontrado em:", logoPath);
  process.exit(1);
}

// Criar diretório de ícones
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

async function generateIcons() {
  console.log("🎨 Gerando ícones a partir do logo...\n");

  for (const size of sizes) {
    try {
      await sharp(logoPath)
        .resize(size, size, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .png()
        .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));

      console.log(`✅ Criado: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(
        `❌ Erro ao criar icon-${size}x${size}.png:`,
        error.message,
      );
    }
  }

  // Criar favicon
  try {
    await sharp(logoPath)
      .resize(32, 32)
      .png()
      .toFile(path.join(__dirname, "../public/favicon.png"));

    console.log("✅ Criado: favicon.png");
  } catch (error) {
    console.error("❌ Erro ao criar favicon:", error.message);
  }

  console.log("\n🎉 Todos os ícones foram gerados com sucesso!");
}

generateIcons().catch(console.error);
