const Mustache = require("mustache")
const fs = require("fs")

const MUSTACHE_MAIN_DIR = "./main.mustache"
const DATA_DIR = "./.github/badges/data.json"
const FONT_FAMILY = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif"

function readData() {
  return JSON.parse(fs.readFileSync(DATA_DIR, "utf8"))
}

function iconSlug(item) {
  return item.label.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-")
}

function measureText(text, fontSize) {
  const narrow = "iIlj1.,;:!|()[]{}' "
  const wide = "mwMWGOQD@"
  let width = 0
  for (const ch of text) {
    if (narrow.includes(ch)) width += fontSize * 0.35
    else if (wide.includes(ch)) width += fontSize * 0.75
    else if (ch === ch.toUpperCase() && ch !== ch.toLowerCase()) width += fontSize * 0.65
    else width += fontSize * 0.55
  }
  return Math.ceil(width)
}

function loadIconSvgContent(item) {
  const path = `./.github/badges/icons/${iconSlug(item)}.svg`
  if (!fs.existsSync(path)) return ""
  const svg = fs.readFileSync(path, "utf8")
  const vbMatch = svg.match(/viewBox="([^"]*)"/)
  const viewBox = vbMatch ? vbMatch[1] : "0 0 24 24"
  const svgTag = svg.match(/<svg[^>]*>/)?.[0] || ""
  const inner = svg
    .replace(/<\?xml[^?]*\?>/g, "")
    .replace(/<svg[^>]*>/, "")
    .replace(/<\/svg>/, "")
    .replace(/<title>[^<]*<\/title>/, "")
    .trim()
  const isStroke = svgTag.includes('fill="none"') && (inner.includes("stroke=") || svgTag.includes("stroke="))
  const fillRule = svgTag.includes('fill-rule="evenodd"') ? 'fill-rule="evenodd"' : ""
  return { viewBox, inner, isStroke, fillRule }
}

function renderIconSvg(icon, x, y, size) {
  if (!icon) return ""
  if (icon.isStroke) {
    return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${icon.viewBox}" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icon.inner}</svg>`
  }
  const coloredInner = icon.inner.replace(/fill=['"](?!none|white)[^'"]*['"]/g, "fill='white'")
  return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${icon.viewBox}" fill="white" ${icon.fillRule}>${coloredInner}</svg>`
}

function flowLayout(items, maxWidth, gapX) {
  const rows = []
  let currentRow = []
  let rowWidth = 0
  for (const item of items) {
    if (rowWidth + item.width + gapX > maxWidth && currentRow.length > 0) {
      rows.push(currentRow)
      currentRow = []
      rowWidth = 0
    }
    currentRow.push(item)
    rowWidth += item.width + gapX
  }
  if (currentRow.length > 0) rows.push(currentRow)
  return rows
}

function generateBadgesSvg(outFile, badges) {
  const iconSize = 36
  const fontSize = 31
  const padX = 20
  const badgeHeight = 62
  const gapX = 12
  const gapY = 12
  const maxWidth = 1400

  const badgeData = badges.map(function (b) {
    const textWidth = measureText(b.label, fontSize)
    const width = Math.ceil(padX + iconSize + 8 + textWidth + padX)
    return { ...b, width }
  })

  const rows = flowLayout(badgeData, maxWidth, gapX)
  const svgHeight = rows.length * (badgeHeight + gapY) + gapY
  let badgeIdx = 0
  const elements = []

  rows.forEach(function (row, ri) {
    const totalRowWidth = row.reduce(function (s, b) { return s + b.width + gapX }, -gapX)
    let x = Math.floor((maxWidth - totalRowWidth) / 2)
    const y = ri * (badgeHeight + gapY) + gapY

    row.forEach(function (b) {
      const delay = (badgeIdx * 0.04).toFixed(2)
      const icon = loadIconSvgContent(b)
      const iconSvg = renderIconSvg(icon, x + padX, y + (badgeHeight - iconSize) / 2, iconSize)
      elements.push(`  <g class="b" style="animation-delay:${delay}s">
    <rect x="${x}" y="${y}" width="${b.width}" height="${badgeHeight}" rx="2" fill="#111"/>
    ${iconSvg}
    <text x="${x + padX + iconSize + 8}" y="${y + badgeHeight / 2 + 1}" fill="white" font-family="${FONT_FAMILY}" font-size="${fontSize}" dominant-baseline="middle">${b.label}</text>
  </g>`)
      x += b.width + gapX
      badgeIdx++
    })
  })

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${maxWidth} ${svgHeight}" width="100%">
<style>
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .b { opacity: 0; animation: fadeIn 0.3s ease forwards; }
</style>
${elements.join("\n")}
</svg>`

  fs.writeFileSync(outFile, svg)
}

function generateLinksSvg(outFile, links) {
  const iconSize = 16
  const fontSize = 13
  const padX = 12
  const iconGap = 6
  const badgeHeight = 32
  const gapX = 10
  const maxWidth = 800
  const borderRadius = 16

  const linkData = links.map(function (l) {
    const textWidth = measureText(l.label, fontSize)
    const width = Math.ceil(padX + iconSize + iconGap + textWidth + padX)
    return { ...l, width }
  })

  const totalWidth = linkData.reduce(function (s, l) { return s + l.width + gapX }, -gapX)
  let x = Math.floor((maxWidth - totalWidth) / 2)
  const y = 4
  const svgHeight = badgeHeight + 8

  const elements = linkData.map(function (l) {
    const icon = loadIconSvgContent(l)
    const iconSvg = renderIconSvg(icon, x + padX, y + (badgeHeight - iconSize) / 2, iconSize)
    const el = `  <a href="${l.url}"><g>
    <rect x="${x}" y="${y}" width="${l.width}" height="${badgeHeight}" rx="${borderRadius}" fill="none" stroke="white" stroke-width="1"/>
    ${iconSvg}
    <text x="${x + padX + iconSize + iconGap}" y="${y + badgeHeight / 2 + 1}" fill="white" font-family="${FONT_FAMILY}" font-size="${fontSize}" dominant-baseline="middle">${l.label}</text>
  </g></a>`
    x += l.width + gapX
    return el
  })

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${maxWidth} ${svgHeight}" width="100%">
${elements.join("\n")}
</svg>`

  fs.writeFileSync(outFile, svg)
}

function buildLinkHtml(links) {
  return links.map(function (l) {
    let logo = l.logo || ""
    if (l.logoSvg) {
      const svgPath = `./.github/badges/icons/${iconSlug(l)}.svg`
      if (fs.existsSync(svgPath)) {
        const svg = fs.readFileSync(svgPath, "utf8")
        logo = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`
      }
    }
    return `<a href="${l.url}" target="_blank"><img src="https://img.shields.io/badge/${encodeURIComponent(l.label)}-000?style=flat-square&logo=${logo}&logoColor=white" alt="${l.label}" /></a>`
  }).join("\n    ")
}

function loadTemplateData(raw) {
  const lines = raw.typingLines.map(function (l) { return encodeURIComponent(l) }).join(";")
  const typingSvgUrl = `https://readme-typing-svg.demolab.com/?lines=${lines}&font=Fira+Code&size=22&duration=3000&pause=1000&color=FFFFFF&center=true&vCenter=true&width=800&height=50`
  const activityGraphUrl = `https://github-readme-activity-graph.vercel.app/graph?username=${raw.username}&theme=high-contrast&hide_border=true&bg_color=000000&color=FFFFFF&line=FFFFFF&point=FFFFFF&area=true&area_color=555555`
  const viewCounterUrl = `https://komarev.com/ghpvc/?username=${raw.username}&style=flat-square&color=000000&label=views`

  const professionalHtml = buildLinkHtml(raw.professionalLinks)
  const socialHtml = buildLinkHtml(raw.socialLinks)

  return { ...raw, typingSvgUrl, activityGraphUrl, viewCounterUrl, professionalHtml, socialHtml }
}

function generateFile(outFile, isHtml, raw) {
  const data = { ...loadTemplateData(raw), isHtml }
  const template = fs.readFileSync(MUSTACHE_MAIN_DIR, "utf8")
  const output = Mustache.render(template, data)
  fs.writeFileSync(outFile, output)
}

if (require.main === module) { const raw = readData(); generateBadgesSvg("badges.svg", raw.badges); console.log("Generated badges.svg"); }

module.exports = { generateFile }
