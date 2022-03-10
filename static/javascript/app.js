// const btn_sharpness = $('#btn_sharpness');
// const btn_bane_of_arthropods = $('#btn_bane_of_arthropods');
// const btn_smite = $('#btn_smite');
// const btn_sweeping = $('#btn_sweeping');
// const btn_unbreaking = $('#btn_unbreaking');
// const btn_knockback = $('#btn_knockback');
// const btn_mending = $('#btn_mending');
// const btn_fire_aspect = $('#btn_fire_aspect');
// const btn_looting = $('#btn_looting');
// const btn_fortune = $('#btn_fortune');
// const btn_silk_touch = $('#btn_silk_touch');
// const btn_efficiency = $('#btn_efficiency');
// const btn_infinity = $('#btn_infinity');
// const btn_flame = $('#btn_flame');
// const btn_power = $('#btn_power');
// const btn_piercing = $('#btn_piercing');
// const btn_multishot = $('#btn_multishot');
// const btn_quick_charge = $('#btn_quick_charge');
// const btn_luck_of_sea = $('#btn_luck_of_sea');
// const btn_lure = $('#btn_lure');
// const btn_impaling = $('#btn_impaling');
// const btn_loyalty = $('#btn_loyalty');
// const btn_channeling = $('#btn_channeling');
// const btn_riptide = $('#btn_riptide');
// const btn_fire_protection = $('#btn_fire_protection');
// const btn_blast_protection = $('#btn_blast_protection');
// const btn_protection = $('#btn_protection');
// const btn_projectile_protection = $('#btn_projectile_protection');
// const btn_thorns = $('#btn_thorns');
// const btn_respiration = $('#btn_respiration');
// const btn_aqua_affinity = $('#btn_aqua_affinity');
// const btn_depth_strider = $('#btn_depth_strider');
// const btn_frost_walker = $('#btn_frost_walker');
// const btn_feather_falling = $('#btn_feather_falling');
//
// let enchants = [
//     btn_sharpness, btn_bane_of_arthropods, btn_smite, btn_sweeping, btn_unbreaking, btn_knockback, btn_mending,
//     btn_fire_aspect, btn_looting, btn_fortune, btn_silk_touch, btn_efficiency, btn_infinity, btn_flame, btn_power,
//     btn_piercing, btn_multishot, btn_quick_charge, btn_luck_of_sea, btn_lure, btn_impaling, btn_loyalty, btn_channeling,
//     btn_riptide, btn_fire_protection, btn_blast_protection, btn_protection, btn_projectile_protection, btn_thorns,
//     btn_respiration, btn_aqua_affinity, btn_depth_strider, btn_frost_walker, btn_feather_falling
// ];

const btn_loyalty = $('#btn_loyalty');
const btn_channeling = $('#btn_channeling');
const btn_riptide = $('#btn_riptide');


function reportWindowSize() {
    var image_area_width = $('.images').width();
    $('.images').css({'height': image_area_width + 'px'});

    var image_width = $('.images img').width();
    $('.images img').css({'height': image_width + 'px'});

    var submit_area_height = $('#submit_area').height();
    $('#enchantArea').css({'min-height': image_width - submit_area_height + 'px'})

    var dropdown_width = $('#submit_area .dropdown').width();
    // $('.container-toggle label').css({'width': dropdown_width + 'px'});

    if (window.innerWidth <= 810) {
        $('.dropdown').removeClass('dropend')
    } else {
        $('.dropdown').addClass('dropend')
    }
}


window.onresize = reportWindowSize;
reportWindowSize();

btn_riptide.prop('checked', false);

const radios = document.querySelectorAll('.rd');

const btn = $('#toggle').change(() => {

    if (btn.prop('checked') == true) {
        radios.forEach(element => {
            element.type = 'checkbox'
            element.checked = true
        });
    } else {
        radios.forEach(element => {
            element.type = 'radio'
        });
        btn_riptide.prop('checked', false)
    }
})

btn_loyalty.change(() => {
    if (btn_loyalty.prop('checked') == true && btn.prop('checked') == false) {
        btn_riptide.prop('checked', false);
    }
});

btn_channeling.change(() => {
    if (btn_channeling.prop('checked') == true && btn.prop('checked') == false) {
        btn_riptide.prop('checked', false);
    }
});

btn_riptide.change(() => {
    if (btn_riptide.prop('checked') == true && btn.prop('checked') == false) {
        btn_loyalty.prop('checked', false);
        btn_channeling.prop('checked', false);
    }
});

// -------------------------------------------------------------------------------------------

const minuses = document.querySelectorAll(".minus");
const pluses = document.querySelectorAll(".plus");
const inputs = document.querySelectorAll(".form-counter");
let selected_meterials = raw_meterials[0]

minuses.forEach(element => {
    element.addEventListener('click', () => {
        var id = element.getAttribute('id')
        id = id.substring(id.indexOf('_') + 1)
        iconClick(id, false)
        createCode(selected_meterials);
    })
});


pluses.forEach(element => {
    element.addEventListener('click', () => {
        var id = element.getAttribute('id');
        id = id.substring(id.indexOf('_') + 1);
        iconClick(id, true);
        createCode(selected_meterials);
    })
});


inputs.forEach(element => {
    element.onkeypress = numbersOnly;
    element.maxLength = 3
    element.addEventListener('blur', () => {
        var value = Number(element.value)
        if (value > 255) {
            element.value = 255
        } else if (value < 1) {
            element.value = 1
        }
        createCode(selected_meterials);
    });
});

function numbersOnly(event) {
    return event.charCode === 0 || /\d/.test(String.fromCharCode(event.charCode));
}

function iconClick(id, isPlus) {

    let input_elemet = document.getElementById('input_' + id)

    var value = Number(input_elemet.value)

    if (isPlus && value < 255) {
        input_elemet.value = value + 1

    } else if (isPlus == false && value > 1) {
        input_elemet.value = value - 1
    }
}

const btn_default = $('#btn_default');
const btn_max = $('#btn_max');

btn_default.click(() => {
    fillLevels(true)
    createCode(selected_meterials);
});

btn_max.click(() => {
    fillLevels(false)
    createCode(selected_meterials);
});

// -------------------------------------------------------------------------------------------

const label = document.querySelector('.code-area label')
const btn_copy = document.getElementById('btn-copy')
const text_area = document.getElementById('text-area')

if (text_area != null) {
    text_area.addEventListener('input', () => {
        text_area.value.split("\n").length
        var lineCount = text_area.value.split(/\r?\n|\r/).length

        if (lineCount > 8) {
            label.style.display = 'none';
        } else {
            label.style.display = 'block';
        }
    });
}

if (btn_copy != null) {
    btn_copy.addEventListener('click', () => {
        text_area.select()
        document.execCommand('copy');
        text_area.blur();
        var lbl = document.querySelector('.copied');

        lbl.classList.remove('c-deact')
        lbl.classList.add('c-act')

        setTimeout(() => {
            lbl.classList.remove('c-act')
            lbl.classList.add('c-deact')
        }, 500)
    });
}

// -------------------------------------------------------------------------------------------

const meterials = document.querySelectorAll('#meterialsArea input ');

if (meterials != null) {
    var meterial_counter = 0;

    meterials.forEach(element => {
        element.addEventListener('change', () => {
            var id = element.getAttribute('id')
            id = id.substring(id.indexOf('_') + 1);
            selected_meterials = raw_meterials[get_meterials_index(id)]
            createCode(selected_meterials)
        });
    });

    function get_meterials_index(id) {
        for (var i = 0; i < raw_meterials.length; i++) {
            if (raw_meterials[i] == id) {
                return i;
            }
        }
        return null;
    }

    meterials.forEach(element => {
        if (meterial_counter == 0)
            element.checked = true
        meterial_counter++
    })
}

// -------------------------------------------------------------------------------------------

function fillLevels(status) {
    var index = 0;

    inputs.forEach(input_element => {
        if (status) {
            input_element.value = model[index][2]
        } else {
            input_element.value = 255
        }
        index++
    });
}

function createCode(raw_material = null) {
    var index = 0
    let middle_text = new Array();

    inputs.forEach(element => {
        var enchant = model[index][1]
        var level = Number(element.value)
        var text = String(`{id:${enchant},lvl:${level}}`)
        middle_text.push(text)
        index++
    });

    let generated_code = null

    if (raw_material === null)
        generated_code = `/give @p minecraft:${item_name}{Unbreakable:1,Enchantments:[${String(middle_text)}]}`

    else
        generated_code = `/give @p minecraft:${raw_material}_${item_name}{Unbreakable:1,Enchantments:[${String(middle_text)}]}`

    text_area.value = generated_code;
}

if (text_area != null)
    createCode(raw_meterials[0]);