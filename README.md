# [Minecraft Bedrock Skin Pack Creator](https://dylynhenderson.github.io/MinecraftBedrockSkinPackCreator/)

A free tool for creating and downloading custom Minecraft Bedrock Edition skin packs in your browser.

> Formatted for desktop and mobile!

---

## Features

### Skin Slots

Add up to 16 skin slots using the **Add Skin Slot** button at the bottom of the page. Each slot is an individual card that holds one complete skin entry.

Once a skin PNG is uploaded, a rotating 3D preview renders the skin wrapped around a player model using [skinview3d](https://github.com/bs-community/skinview3d)

> [!IMPORTANT]
> Must be a valid Minecraft skin PNG (64×64 or 64×128 pixels).

Choose between **Normal (4px)** and **Slim (3px)** arm geometry per skin. This sets the correct geometry reference (`geometry.humanoid.custom` or `geometry.humanoid.customSlim`) in the generated `skins.json`.

Optionally upload a cape PNG for this skin. The cape will appear on the back of the 3D preview and will be bundled into the pack alongside the skin. If no cape is uploaded for a slot, the cape field is omitted from the pack entirely for that skin.

> [!NOTE]
> Capes require special implementation to appear in game.

### Minecraft Formatting Toolbar

Both the pack name and each skin name have a formatting toolbar containing:
- **16 color options** from Minecraft
- **Bold, Italic, Underline, Strikethrough** formatting toggles
- **Reset** button to strip all active formatting

```
§0 §1 §2 §3 §4 §5 §6 §7 §8 §9 §a §b §c §d §e §f §l §o §n §m §r
```

> [!IMPORTANT]
> These are Minecraft's native formatting codes. Position your cursor before the text you want to format, then click a button to insert the code.

Clicking a button inserts the appropriate `§` code at the cursor position in the text field. The live preview renders the result immediately so you always see the in-game output before downloading.

> [!CAUTION]
> This tool does not save your work between sessions.

---

## How to use your Skinpack

### Build & Download
Click **Build & Download .mcpack** to generate the skin pack. The tool assembles all uploaded textures and metadata entirely in the browser — no data is sent to any server. The output is a valid `.mcpack` file that Minecraft Bedrock Edition can import directly.

> [!WARNING]
> Create a unique name for each skinpack you create, or Minecraft may have problems.

The generated pack includes:
- `manifest.json` with randomly generated UUIDs and version metadata
- `skins.json` with all skin entries, geometry references, textures, and optional cape fields
- `texts/en_US.lang` with the pack name and each skin's display name including all formatting codes
- All uploaded skin and cape PNG files

### How to Import

**Windows:** Double-click the `.mcpack` file. Minecraft will open and import it automatically.

**Android:** Open the `.mcpack` file with the Minecraft app from your file manager.

**iOS:** Tap the `.mcpack` file and open it in Minecraft.

> [!NOTE]
> Direct `.mcpack` import is not supported on console.

---

## To be Implemented

- [ ] Larger skinpack size
- [ ] Restrictions on uploaded files
- [ ] Local saving of skins and packs
- [ ] Adding Minecraft's native emojis to formatting toolbar
- [ ] More user-friendly UI
