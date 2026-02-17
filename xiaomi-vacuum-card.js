((LitElement) => {
    console.info(
        '%c XIAOMI-VACUUM-CARD %c 5.0.2 ',
        'color: cyan; background: black; font-weight: bold;',
        'color: darkblue; background: white; font-weight: bold;',
    );

    const state = {
        status: {
            key: 'status',
            icon: 'mdi:robot-vacuum',
        },
        battery: {
            key: 'battery_level',
            unit: '%',
            icon: 'mdi:battery-charging-80',
        },
        mode: {
            key: 'fan_speed',
            icon: 'mdi:fan',
        },
    };

    const attributes = {
        main_brush: {
            key: 'main_brush_left',
            label: 'Main Brush: ',
            unit: ' h',
        },
        side_brush: {
            key: 'side_brush_left',
            label: 'Side Brush: ',
            unit: ' h',
        },
        filter: {
            key: 'filter_left',
            label: 'Filter: ',
            unit: ' h',
        },
        sensor: {
            key: 'sensor_dirty_left',
            label: 'Sensor: ',
            unit: ' h',
        },
    };

    const buttons = {
        start: {
            label: 'Start',
            icon: 'mdi:play',
            service: 'vacuum.start',
        },
        pause: {
            label: 'Pause',
            icon: 'mdi:pause',
            service: 'vacuum.pause',
        },
        stop: {
            label: 'Stop',
            icon: 'mdi:stop',
            service: 'vacuum.stop',
        },
        spot: {
            show: false,
            label: 'Clean Spot',
            icon: 'mdi:broom',
            service: 'vacuum.clean_spot',
        },
        locate: {
            label: 'Locate',
            icon: 'mdi:map-marker',
            service: 'vacuum.locate',
        },
        return: {
            label: 'Return to Base',
            icon: 'mdi:home-map-marker',
            service: 'vacuum.return_to_base',
        },
    };

    const compute = {
        trueFalse: v => (v === true ? 'Yes' : (v === false ? 'No' : '-')),
        divide100: v => Math.round(Number(v) / 100),
        secToHour: v => Math.floor(Number(v) / 60 / 60),
    }

    const vendors = {
        xiaomi: {
            attributes: {
                main_brush: {compute: compute.secToHour},
                side_brush: {compute: compute.secToHour},
                filter: {compute: compute.secToHour},
                sensor: {compute: compute.secToHour},
            }
        },
        xiaomi_mi: {
            attributes: {
                main_brush: {key: 'main_brush_hours'},
                side_brush: {key: 'side_brush_hours'},
                filter: {key: 'hypa_hours'},
                sensor: {
                    key: 'mop_hours',
                    label: 'Mop: ',
                },
            },
        },
        valetudo: {
            state: {
                status: {key: 'state'},
            },
            attributes: {
                main_brush: {key: 'mainBrush'},
                side_brush: {key: 'sideBrush'},
                filter: {key: 'filter'},
                sensor: {key: 'sensor'},
            },
        },
        roomba: {
            attributes: {
                main_brush: false,
                side_brush: false,
                filter: false,
                sensor: false,
                bin_present: {
                    key: 'bin_present',
                    label: 'Bin Present: ',
                    compute: compute.trueFalse,
                },
                bin_full: {
                    key: 'bin_full',
                    label: 'Bin Full: ',
                    compute: compute.trueFalse,
                },
            },
        },
        robovac: {
            attributes: false,
            buttons: {
                stop: {show: false},
                spot: {show: true},
            },
        },
        ecovacs: {
            attributes: false,
            buttons: {
                start: {service: 'vacuum.turn_on'},
                pause: {service: 'vacuum.stop'},
                stop: {service: 'vacuum.turn_off', show: false},
                spot: {show: true},
            },
        },
        deebot: {
            buttons: {
                start: {service: 'vacuum.turn_on'},
                pause: {service: 'vacuum.stop'},
                stop: {service: 'vacuum.turn_off'},
            },
            attributes: {
                main_brush: {
                    key: 'component_main_brush',
                    compute: compute.divide100,
                },
                side_brush: {
                    key: 'component_side_brush',
                    compute: compute.divide100,
                },
                filter: {
                    key: 'component_filter',
                    compute: compute.divide100,
                },
                sensor: false,
            },
        },
        deebot_slim: {
            buttons: {
                start: {service: 'vacuum.turn_on'},
                pause: {service: 'vacuum.stop'},
                stop: {service: 'vacuum.turn_off'},
            },
            attributes: {
                main_brush: false,
                side_brush: {key: 'component_side_brush'},
                filter: {key: 'component_filter'},
                sensor: false,
            },
        },
        neato: {
            state: {
                mode: false,
            },
            attributes: {
                main_brush: false,
                side_brush: false,
                filter: false,
                sensor: false,
                clean_area: {
                    key: 'clean_area',
                    label: 'Cleaned area: ',
                    unit: ' m2',
                },
            },
        },
    };

    const html = LitElement.prototype.html;
    const css = LitElement.prototype.css;

    class XiaomiVacuumCard extends LitElement {

        static get properties() {
            return {
                _hass: {},
                config: {},
                stateObj: {},
            }
        }

        static get styles() {
            return css`
.background {
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}
.title {
  font-size: 20px;
  padding: 12px 16px 8px;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, auto);
  cursor: pointer;
}
.grid-content {
  display: grid;
  align-content: space-between;
  grid-row-gap: 6px;
}
.grid-left {
  text-align: left;
  font-size: 110%;
  padding-left: 10px;
  border-left: 2px solid var(--primary-color);
}
.grid-right {
  text-align: right;
  padding-right: 10px;
  border-right: 2px solid var(--primary-color);
}`;
        }

        render() {
            return this.stateObj ? html`
            <ha-card class="background" style="${this.config.styles.background}">
              ${this.config.show.name ?
                html`<div class="title">${this.config.name || this.stateObj.attributes.friendly_name}</div>`
                : null}
              ${(this.config.show.state || this.config.show.attributes) ? html`
              <div class="grid" style="${this.config.styles.content}" @click="${() => this.fireEvent('hass-more-info')}">
                ${this.config.show.state ? html`
                <div class="grid-content grid-left">
                  ${Object.values(this.config.state).filter(v => v).map(this.renderAttribute.bind(this))}
                </div>` : null}
                ${this.config.show.attributes ? html`
                <div class="grid-content grid-right">
                  ${Object.values(this.config.attributes).filter(v => v).map(this.renderAttribute.bind(this))}
                </div>` : null}
              </div>` : null}
              ${this.config.show.buttons ? html`
              <div class="flex">
                ${Object.values(this.config.buttons).filter(v => v).map(this.renderButton.bind(this))}
              </div>` : null}
            </ha-card>` : html`<ha-card style="padding: 8px 16px">Entity '${this.config.entity}' not available...</ha-card>`;
        }

        renderAttribute(data) {
            if (!data) return null;

            const computeFunc = data.compute || (v => v);
            let value = null;
            let rawValue = null;

            // Priority 1: Check if a specific entity is defined for this attribute
            if (data.entity) {
                console.log('Looking for entity:', data.entity);
                console.log('Entity exists:', data.entity in this._hass.states);
                const entityState = this._hass.states[data.entity];
                if (entityState) {
                    console.log('Entity state:', entityState.state);
                    rawValue = entityState.state;
                    // Check if state is unavailable or unknown
                    if (rawValue !== 'unavailable' && rawValue !== 'unknown') {
                        value = computeFunc(rawValue) + (data.unit || '');
                        console.log('Computed value:', value);
                    } else {
                        console.log('Entity state is unavailable or unknown');
                    }
                } else {
                    console.log('Entity not found in hass.states');
                }
            }
            // Priority 2: Check for sensor entity pattern (sensor.vacuum_name_key)
            else if (data.key) {
                const sensorEntityId = `${this.config.sensorEntity}_${data.key}`;
                if (sensorEntityId in this._hass.states) {
                    rawValue = this._hass.states[sensorEntityId].state;
                    if (rawValue !== 'unavailable' && rawValue !== 'unknown') {
                        value = computeFunc(rawValue) + (data.unit || '');
                    }
                }
                // Priority 3: Check vacuum entity attributes
                else if (data.key in this.stateObj.attributes) {
                    rawValue = this.stateObj.attributes[data.key];
                    value = computeFunc(rawValue) + (data.unit || '');
                }
                // Priority 4: Check vacuum entity state properties
                else if (data.key in this.stateObj) {
                    rawValue = this.stateObj[data.key];
                    value = computeFunc(rawValue) + (data.unit || '');
                }
            }

            const attribute = html`<div>
                ${data.icon && this.renderIcon(data)}
                ${(data.label || '') + (value !== null ? value : this._hass.localize('state.default.unavailable'))}
            </div>`;

            const hasDropdown = data.key && `${data.key}_list` in this.stateObj.attributes;

            return (hasDropdown && value !== null)
                ? this.renderDropdown(attribute, data.key, data.service)
                : attribute;
        }

        renderIcon(data) {
            const icon = (data.key === 'battery_level' && 'battery_icon' in this.stateObj.attributes)
                ? this.stateObj.attributes.battery_icon
                : data.icon;
            return html`<ha-icon icon="${icon}" style="margin-right: 10px; ${this.config.styles.icon}"></ha-icon>`;
        }

        renderButton(data) {
            return data && data.show !== false
                ? html`<ha-icon-button
                    @click="${() => this.callService(data.service, data.service_data)}"
                    title="${data.label || ''}"
                    style="${this.config.styles.icon}">
                      <ha-icon style="display:flex;" icon="${data.icon}"></ha-icon>
                    </ha-icon-button>`
                : null;
        }

        renderDropdown(attribute, key, service) {
            const list = this.stateObj.attributes[`${key}_list`];

            return html`
                <div style="position: relative" @click=${e => e.stopPropagation()}>
                    <ha-button @click=${() => this.toggleMenu(key)}>
                      ${attribute}
                    </ha-button>
                    <mwc-menu
                      @selected=${e => this.handleChange(list[e.detail.index], key, service)}
                      id=${`xvc-menu-${key}`}
                      activatable
                      corner="BOTTOM_START">
                        ${list.map(item => html`<mwc-list-item value=${item}>${item}</mwc-list-item>`)}
                    </mwc-menu>
                </div>`;
        }

        toggleMenu(key) {
            const menu = this.shadowRoot.querySelector(`#xvc-menu-${key}`);
            if (menu) {
                menu.open = !menu.open;
            }
        }

        getCardSize() {
            if (this.config.show.name && this.config.show.buttons) return 4;
            if (this.config.show.name || this.config.show.buttons) return 3;
            return 2;
        }

        shouldUpdate(changedProps) {
            return changedProps.has('stateObj') || changedProps.has('_hass');
        }

        setConfig(config) {
            if (!config.entity) throw new Error('Please define an entity.');
            if (config.entity.split('.')[0] !== 'vacuum') throw new Error('Please define a vacuum entity.');
            if (config.vendor && !(config.vendor in vendors)) throw new Error('Please define a valid vendor.');

            const vendor = vendors[config.vendor] || vendors.xiaomi;

            // Process compute functions from config
            const processComputeFunctions = (obj) => {
                if (!obj || typeof obj !== 'object') return obj;
                
                const processed = {};
                for (const [key, value] of Object.entries(obj)) {
                    if (value && typeof value === 'object') {
                        processed[key] = processComputeFunctions(value);
                        
                        // Convert string compute functions to actual functions
                        if (value.compute && typeof value.compute === 'string') {
                            try {
                                // Handle common compute patterns
                                if (value.compute === 'minToHour' || value.compute === 'min_to_hour') {
                                    processed[key].compute = v => Math.floor(Number(v) / 60);
                                } else if (value.compute === 'secToHour' || value.compute === 'sec_to_hour') {
                                    processed[key].compute = v => Math.floor(Number(v) / 60 / 60);
                                } else if (value.compute === 'divide100') {
                                    processed[key].compute = v => Math.round(Number(v) / 100);
                                } else if (value.compute === 'trueFalse') {
                                    processed[key].compute = v => (v === true ? 'Yes' : (v === false ? 'No' : '-'));
                                } else {
                                    // Try to evaluate as function
                                    processed[key].compute = new Function('v', `return ${value.compute}`);
                                }
                            } catch (e) {
                                console.warn(`Invalid compute function for ${key}:`, e);
                            }
                        }
                    } else {
                        processed[key] = value;
                    }
                }
                return processed;
            };

            this.config = {
                name: config.name,
                entity: config.entity,
                sensorEntity: config.sensor_entity || `sensor.${config.entity.split('.')[1]}`,
                show: {
                    name: config.name !== false,
                    state: config.state !== false,
                    attributes: config.attributes !== false,
                    buttons: config.buttons !== false,
                },
                buttons: this.deepMerge(buttons, vendor.buttons, processComputeFunctions(config.buttons)),
                state: this.deepMerge(state, vendor.state, processComputeFunctions(config.state)),
                attributes: this.deepMerge(attributes, vendor.attributes, processComputeFunctions(config.attributes)),
                styles: {
                    background: config.image ? `background-image: url('${config.image}'); color: white; text-shadow: 0 0 10px black;` : '',
                    icon: `color: ${config.image ? 'white' : 'var(--paper-item-icon-color)'};`,
                    content: `padding: ${config.name !== false ? '8px' : '16px'} 16px ${config.buttons !== false ? '8px' : '16px'};`,
                },
            };
        }

        set hass(hass) {
            if (hass && this.config) {
                this.stateObj = this.config.entity in hass.states ? hass.states[this.config.entity] : null;
            }
            this._hass = hass;
        }

        handleChange(mode, key, service) {
            this.callService(service || `vacuum.set_${key}`, {entity_id: this.stateObj.entity_id, [key]: mode});
        }

        callService(service, data = {entity_id: this.stateObj.entity_id}) {
            const [domain, name] = service.split('.');
            this._hass.callService(domain, name, data);
        }

        fireEvent(type, options = {}) {
            const event = new Event(type, {
                bubbles: options.bubbles !== undefined ? options.bubbles : true,
                cancelable: options.cancelable !== undefined ? options.cancelable : true,
                composed: options.composed !== undefined ? options.composed : true,
            });
            event.detail = {entityId: this.stateObj.entity_id};
            this.dispatchEvent(event);
        }

        deepMerge(...sources) {
            const isObject = (obj) => obj && typeof obj === 'object' && !Array.isArray(obj);
            const target = {};

            sources.filter(source => isObject(source)).forEach(source => {
                Object.keys(source).forEach(key => {
                    const targetValue = target[key];
                    const sourceValue = source[key];

                    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
                        target[key] = targetValue.concat(sourceValue);
                    } else if (isObject(targetValue) && isObject(sourceValue)) {
                        target[key] = this.deepMerge(Object.assign({}, targetValue), sourceValue);
                    } else {
                        target[key] = sourceValue;
                    }
                });
            });

            return target;
        }
    }

    customElements.define('xiaomi-vacuum-card', XiaomiVacuumCard);
})(window.LitElement || Object.getPrototypeOf(customElements.get("hui-masonry-view") || customElements.get("hui-view")));
