# xiaomi-vacuum-card

Simple card for various robot vacuums in Home Assistant's Lovelace UI

[![GH-release](https://img.shields.io/github/v/release/benct/lovelace-xiaomi-vacuum-card.svg?style=flat-square)](https://github.com/benct/lovelace-xiaomi-vacuum-card/releases)
[![GH-downloads](https://img.shields.io/github/downloads/benct/lovelace-xiaomi-vacuum-card/total?style=flat-square)](https://github.com/benct/lovelace-xiaomi-vacuum-card/releases)
[![GH-last-commit](https://img.shields.io/github/last-commit/benct/lovelace-xiaomi-vacuum-card.svg?style=flat-square)](https://github.com/benct/lovelace-xiaomi-vacuum-card/commits/master)
[![GH-code-size](https://img.shields.io/github/languages/code-size/benct/lovelace-xiaomi-vacuum-card.svg?color=red&style=flat-square)](https://github.com/benct/lovelace-xiaomi-vacuum-card)
[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=flat-square)](https://github.com/hacs)

Integrated support for most vacuums from the following brands/models:
Xiaomi, Roomba, Neato, Robovac, Valetudo, Ecovacs, Deebot

# Xiaomi Vacuum Card v5.0.0

A custom Lovelace card for Home Assistant to control and monitor robot vacuum cleaners.

> Updated for **Home Assistant 2026.02**

---

## What's New in v5.0.0

### Separate Sensor Entity Support
Attributes (brush life, filter, etc.) can now be read from individual sensor entities instead of only from vacuum entity attributes. This is useful for integrations like Valetudo that expose consumable data as separate sensors.

### Configurable Sensor Entity Prefix
Added `sensor_entity` option to customize which sensor prefix the card uses for auto-detection.

### String-based Compute Functions in YAML
You can now define compute (value transformation) functions directly in your YAML config using built-in named functions, instead of only relying on vendor defaults.

### Bug Fixes
- Fixed vendor validation check (`!(config.vendor in vendors)`)
- Improved `shouldUpdate` to react to all hass state changes, not just `stateObj`
- Fixed `fireEvent` options handling
- Improved `deepMerge` to correctly differentiate arrays from plain objects
- Fixed null-check on `toggleMenu`

---

## Installation

1. Copy `xiaomi-vacuum-card.js` to `/config/www/community/lovelace-xiaomi-vacuum-card/`
2. Delete any existing `.gz` file in that folder (it will override your `.js` file otherwise):
   ```bash
   rm /config/www/community/lovelace-xiaomi-vacuum-card/xiaomi-vacuum-card.js.gz
   ```
3. Add the resource in **Settings → Dashboards → Resources**:
   ```
   /local/community/lovelace-xiaomi-vacuum-card/xiaomi-vacuum-card.js?v=5.0.0
   ```
   > The `?v=5.0.0` parameter forces the browser to load the new file instead of a cached version. Increment it every time you update the file.

4. Hard refresh your browser: `Ctrl + Shift + R`

> **Tip:** If the browser still loads the old version, open an incognito window or clear site data for your Home Assistant URL via `chrome://settings/content/all`.

---

## Configuration

### Minimal

```yaml
type: custom:xiaomi-vacuum-card
entity: vacuum.my_vacuum
```

### Full Example

```yaml
type: custom:xiaomi-vacuum-card
entity: vacuum.valetudo_roborock_s5
name: Robot Vacuum
image: /local/img/vacuum.png
vendor: valetudo
sensor_entity: sensor.valetudo_roborock_s5   # optional, custom sensor prefix
attributes:
  main_brush:
    entity: sensor.valetudo_roborock_s5_main_brush
    label: 'Main Brush: '
    unit: ' h'
    compute: minToHour
  side_brush:
    entity: sensor.valetudo_roborock_s5_side_brush
    label: 'Side Brush: '
    unit: ' h'
    compute: minToHour
  filter:
    entity: sensor.valetudo_roborock_s5_main_filter
    label: 'Filter: '
    unit: ' h'
    compute: minToHour
  sensor:
    entity: sensor.valetudo_roborock_s5_sensor
    label: 'Sensor: '
    unit: ' h'
    compute: minToHour
```

---

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entity` | string | **required** | Vacuum entity ID (`vacuum.xxx`) |
| `name` | string/false | friendly name | Card title. Set to `false` to hide |
| `image` | string | — | Background image URL |
| `vendor` | string | `xiaomi` | Vendor preset (see below) |
| `sensor_entity` | string | `sensor.{vacuum_name}` | Custom prefix for auto-detected sensors |
| `state` | object/false | — | Override state display. Set to `false` to hide |
| `attributes` | object/false | — | Override attributes display. Set to `false` to hide |
| `buttons` | object/false | — | Override buttons. Set to `false` to hide |

---

## Attribute Configuration

Each attribute entry supports:

| Property | Type | Description |
|----------|------|-------------|
| `entity` | string | Full entity ID to read value from (highest priority) |
| `key` | string | Attribute key or state property on the vacuum entity |
| `label` | string | Display label |
| `unit` | string | Unit appended to the value |
| `icon` | string | MDI icon name |
| `compute` | string | Named compute function (see below) |

### Attribute Value Resolution Priority

1. **`entity`** — reads state from a specific HA entity
2. **Auto sensor** — looks for `sensor.{vacuum_name}_{key}` automatically
3. **Vacuum attribute** — reads from `vacuum.xxx` entity attributes
4. **Vacuum state property** — reads from `vacuum.xxx` state object directly

### Compute Functions

Use these named functions in your YAML `compute` field to transform sensor values:

| Name | Description | Example |
|------|-------------|---------|
| `minToHour` | Minutes → Hours | `17976` → `299` |
| `secToHour` | Seconds → Hours | `107856` → `29` |
| `divide100` | Divide by 100 | `9500` → `95` |
| `trueFalse` | Boolean → Yes/No | `true` → `Yes` |

Example usage:
```yaml
attributes:
  main_brush:
    entity: sensor.valetudo_roborock_s5_main_brush
    label: 'Main Brush: '
    unit: ' h'
    compute: minToHour
```

---

## Supported Vendors

| Vendor | Description |
|--------|-------------|
| `xiaomi` | Default. Reads consumables in seconds from vacuum attributes |
| `xiaomi_mi` | Mi Robot — reads from `main_brush_hours`, `hypa_hours`, etc. |
| `valetudo` | Valetudo firmware — reads from `mainBrush`, `sideBrush`, etc. |
| `roomba` | iRobot Roomba — shows bin status instead of consumables |
| `robovac` | Eufy RoboVac — no attributes, adds Spot button |
| `ecovacs` | Ecovacs — uses `turn_on`/`turn_off` services |
| `deebot` | Deebot — reads `component_*` attributes, divides by 100 |
| `deebot_slim` | Deebot Slim — no main brush |
| `neato` | Neato — shows cleaned area instead of consumables |

---

## Buttons

Default buttons: **Start**, **Pause**, **Stop**, **Locate**, **Return to Base**

You can override any button:
```yaml
buttons:
  spot:
    show: true      # hidden by default
  stop:
    show: false     # hide stop button
  start:
    service: vacuum.turn_on   # override service
```

---

## Troubleshooting

### Attributes show "Unavailable"
- The entity IDs you specified don't exist in Home Assistant
- Go to **Developer Tools → States** and search for your vacuum name to find the correct entity IDs
- Make sure there is no `.gz` file overriding your `.js` file:
  ```bash
  ls /config/www/community/lovelace-xiaomi-vacuum-card/
  rm /config/www/community/lovelace-xiaomi-vacuum-card/xiaomi-vacuum-card.js.gz
  ```

### Old version still loading after update
1. Delete the `.gz` file alongside the `.js`
2. Add `?v=5.0.0` to your resource URL in Settings → Dashboards → Resources
3. Hard refresh: `Ctrl + Shift + R`
4. If still failing: open Chrome in incognito to confirm the new file works, then clear Chrome's site data for your HA URL via `chrome://settings/content/all`

### Card not found / not loading
- Confirm the resource URL matches the actual file path
- Check browser console (`F12`) for JavaScript errors
- Verify the new version is loaded — open console and look for:
  ```
  XIAOMI-VACUUM-CARD 5.0.0
  ```

---

## Changelog

### v5.0.0
- Added `entity` property per attribute to read from any separate sensor entity
- Added `sensor_entity` config option for custom sensor prefix
- Added named compute functions in YAML: `minToHour`, `secToHour`, `divide100`, `trueFalse`
- Fixed vendor validation logic
- Fixed `shouldUpdate` to react to all hass changes
- Fixed `fireEvent` options defaults
- Fixed `deepMerge` handling of arrays vs plain objects
- Fixed null guard on `toggleMenu`

### v4.5.0
- Original release


## Installation

Manually add [xiaomi-vacuum-card.js](https://raw.githubusercontent.com/benct/lovelace-xiaomi-vacuum-card/master/xiaomi-vacuum-card.js)
to your `<config>/www/` folder and add the following to the `configuration.yaml` file:
```yaml
lovelace:
  resources:
    - url: /local/xiaomi-vacuum-card.js?v=4.5.0
      type: module
```

_OR_ install using [HACS](https://hacs.xyz/) and add this (if in YAML mode):
```yaml
lovelace:
  resources:
    - url: /hacsfiles/lovelace-xiaomi-vacuum-card/xiaomi-vacuum-card.js
      type: module
```

The above configuration can be managed directly in the Configuration -> Lovelace Dashboards -> Resources panel when not using YAML mode,
or added by clicking the "Add to lovelace" button on the HACS dashboard after installing the plugin.

If you want to use the vacuum background image, download and add
[img/vacuum.png](https://raw.githubusercontent.com/benct/lovelace-xiaomi-vacuum-card/master/img/vacuum.png)
to `<config>/www/img/` or configure your own preferred path.

## Configuration

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `custom:xiaomi-vacuum-card`
| entity | string | **Required** | `vacuum.my_xiaomi_vacuum`
| name | string/bool | `friendly_name` | Override friendly name (set to `false` to hide)
| image | string/bool | `false` | Set path/filename of background image (i.e. `/local/img/vacuum.png`)
| state | [Entity Data](#entity-data) | *(see below)* | Set to `false` to hide all states
| attributes | [Entity Data](#entity-data) | *(see below)* | Set to `false` to hide all attributes
| buttons | [Button Data](#button-data) | *(see below)* | Set to `false` to hide button row

### Entity Data

Default vacuum attributes under each list:
- `state` (**left list**) include `status`, `battery` and `mode`.
- `attributes` (**right list**) include `main_brush`, `side_brush`, `filter` and `sensor`.

See [examples](#examples) on how to customize, hide or add custom attributes.

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| key | string | **Required** | Attribute/state key on vacuum entity
| icon | string | | Optional icon
| label | string | | Optional label text
| unit | string | | Optional unit

### Button Data

Default buttons include `start`, `pause`, `stop`, `spot` (hidden), `locate` and `return`.
See [examples](#examples) on how to customize, hide or add custom buttons/actions.

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| icon | string | **Required** | Show or hide stop button
| service | string | **Required** | Service to call (i.e `vacuum.start`)
| show | bool | `true` | Show or hide button
| label | string | | Optional label on hover
| service_data | object | | Data applied to the service call

### Other vendors

This card was originally written for Xiaomi (Roborock) vacuum cleaners, but version `2.0` and later has added support for some other vendors too.
If you want any other vendors to be added, feel free to open an issue or contribute directly with a PR.

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| vendor | string | `xiaomi` | Supported vendors: `xiaomi`, `xiaomi_mi`, `valetudo`, `ecovacs`, `deebot`, `deebot_slim`, `robovac`, `roomba`, `neato`

*Note: Default attributes and buttons may change for each vendor integration.*

## Screenshots

![xiaomi-vacuum-card](https://raw.githubusercontent.com/benct/lovelace-xiaomi-vacuum-card/master/examples/default.png)

![xiaomi-vacuum-card-no-title](https://raw.githubusercontent.com/benct/lovelace-xiaomi-vacuum-card/master/examples/no-title.png)

![xiaomi-vacuum-card-image](https://raw.githubusercontent.com/benct/lovelace-xiaomi-vacuum-card/master/examples/with-image.png)

![xiaomi-vacuum-card-no-buttons](https://raw.githubusercontent.com/benct/lovelace-xiaomi-vacuum-card/master/examples/no-buttons.png)

## Examples

Basic configuration:
```yaml
- type: custom:xiaomi-vacuum-card
  entity: vacuum.xiaomi_vacuum_cleaner
```

```yaml
- type: custom:xiaomi-vacuum-card
  entity: vacuum.xiaomi_vacuum_cleaner
  image: /local/custom/folder/background.png
  name: My Vacuum
  vendor: xiaomi
```

Hide state, attributes and/or buttons:
```yaml
- type: custom:xiaomi-vacuum-card
  entity: vacuum.xiaomi_vacuum_cleaner
  state: false
  attributes: false
  buttons: false
```

Hide specific state values, attributes and/or buttons:
```yaml
- type: custom:xiaomi-vacuum-card
  entity: vacuum.xiaomi_vacuum_cleaner
  state:
    mode: false
  attributes:
    main_brush: false
    side_brush: false
  buttons:
    pause: false
    locate: false
``` 

Customize specific state values, attributes and/or buttons:
```yaml
- type: custom:xiaomi-vacuum-card
  entity: vacuum.xiaomi_vacuum_cleaner
  state:
    status:
      key: state
    mode:
      icon: mdi:robot-vacuum
      label: 'Fan speed: '
      unit: 'percent'
  attributes:
    main_brush:
      key: component_main_brush
    side_brush:
      key: component_side_brush
  buttons:
    pause:
      icon: mdi:stop
      label: Hold
      service: vacuum.stop
```

Show default clean spot button:
```yaml
- type: custom:xiaomi-vacuum-card
  entity: vacuum.xiaomi_vacuum_cleaner
  buttons:
    spot:
      show: true
```

Add custom attributes:
```yaml
- type: custom:xiaomi-vacuum-card
  entity: vacuum.xiaomi_vacuum_cleaner
  attributes:
    clean_area:
      key: 'clean_area'
      label: 'Cleaned area: '
      unit: ' m2'
```

Add custom buttons and service calls:
```yaml
- type: custom:xiaomi-vacuum-card
  entity: vacuum.xiaomi_vacuum_cleaner
  buttons:
    new_button:
      icon: mdi:light-switch
      label: Custom button!
      service: light.turn_off
      service_data:
        entity_id: light.living_room
```

Translations:
```yaml
- type: custom:xiaomi-vacuum-card
  entity: vacuum.xiaomi_vacuum_cleaner
  attributes:
    main_brush:
      label: 'Hovedkost: '
      unit: ' timer'
    side_brush:
      label: 'Sidekost: '
      unit: ' timer'
    filter:
      label: 'Filtere: '
    sensor:
      label: 'Sensorer: '
  buttons:
    start:
      label: Start!
    pause:
      label: Stopp!
    stop:
      label: Hammertime
```

## Disclaimer

This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with the Xiaomi Corporation,
or any of its subsidiaries or its affiliates. The official Xiaomi website can be found at https://www.mi.com/global/.

## My cards

[xiaomi-vacuum-card](https://github.com/benct/lovelace-xiaomi-vacuum-card) | 
[multiple-entity-row](https://github.com/benct/lovelace-multiple-entity-row) | 
[github-entity-row](https://github.com/benct/lovelace-github-entity-row) | 
[battery-entity-row](https://github.com/benct/lovelace-battery-entity-row) | 
[~~attribute-entity-row~~](https://github.com/benct/lovelace-attribute-entity-row)

[![BMC](https://www.buymeacoffee.com/assets/img/custom_images/white_img.png)](https://www.buymeacoff.ee/benct)
