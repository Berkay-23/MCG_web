from functools import wraps
from flask import *
import requests
import json

def getJSON():
    with open(r'ItemDatas.json') as file:
        data = json.load(file)
    return data

def get_item_details(item_name: str):
    request_data = getJSON()

    for item in request_data['ItemDetail']:
        if item == item_name:
            enchants = request_data['ItemDetail'][item]['Enchants']
            image_path = str(request_data['ItemDetail'][item]['ImagePath']).replace('\n', '').replace('\r', '')
            name = str(request_data['ItemDetail'][item]['Item']['Name'])
            raw_materials = list()

            if "RawMaterials" in dict(request_data['ItemDetail'][item]['Item']).keys():
                raw_materials = request_data['ItemDetail'][item]['Item']['RawMaterials']

            return (name, raw_materials, enchants, image_path)

def split_enchants(enchant_list: list):
    common_enchants = set()
    anti_sets = list()

    request_data = getJSON()
    enchants = dict(request_data['Enchants'])

    for selected_enchant in enchant_list:
        enchant = dict(enchants[selected_enchant])

        if 'CounterEnchants' in enchant.keys():
            anti_set = set()
            anti_set.add(enchant['Name'])

            for anti_ench in enchant['CounterEnchants']:
                anti_set.add(anti_ench)

            anti_sets.append(anti_set)
        else:
            common_enchants.add(enchant['Name'])

    i = 0
    while i < len(anti_sets):
        j = i + 1
        while j < len(anti_sets):
            if (anti_sets[i].issuperset(anti_sets[j])):
                anti_sets.pop(j)
            else:
                j += 1
        i += 1

    return (common_enchants, anti_sets)

def edit_enchants(enchant_tuple: tuple, item_name: str):
    common_enchants = set(enchant_tuple[0])
    anti_sets = list(enchant_tuple[1])

    if item_name != 'bow':
        common_enchants.add('mending')
        anti_sets.remove({'mending', 'infinity'})

    if item_name == 'trident':
        common_enchants.add('riptide')
        common_enchants.add('loyalty')
        common_enchants.add('channeling')
        anti_sets.clear()

    return {'common_enchants': common_enchants, 'anti_sets': anti_sets}

def item_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        request_data = getJSON()
        items = dict(request_data['Items'])

        if kwargs['id'] in items.keys():
            return f(*args, **kwargs)
        else:
            return render_template('404.html', message='item not found')

    return decorated_function

def model_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if ('id' in kwargs) and ('item' and 'model' in session) and (kwargs['id'] == session['item']):
            return f(*args, **kwargs)
        else:
            return render_template('404.html', message="you didn't choose enchants")

    return decorated_function


app = Flask(__name__)
app.debug = True
app.secret_key = 'MCG Project'


@app.route('/')
def index():
    return render_template('index.html', model=None)


@app.route(r'/<string:id>', methods=['GET', 'POST'])
@item_required
def item_detail(id: str):
    if request.method == 'GET':
        details = get_item_details(id)
        enchants_tuple = split_enchants(details[2])
        edited_enchants = edit_enchants(enchants_tuple, details[0])

        model = {
            'name': details[0],
            'raw_materials': details[1],
            'image': details[3],
            'common_enchants': edited_enchants['common_enchants'],
            'anti_sets': edited_enchants['anti_sets']
        }
        return render_template('index.html', model=model)

    elif request.method == 'POST':

        # veriables
        model = list()
        raw_meterials = list()
        image_path: str

        # request to dict
        request_data = dict(request.form.to_dict(flat=False))
        final_list = list()

        # dict element to list
        for list_item in request_data.values():
            final_list += list_item

        # JSON file reading
        request_data = getJSON()
        item_details = dict(request_data['ItemDetail'])
        enchants = dict(request_data['Enchants'])
        items = dict(request_data['Items'])

        # [id , enchant_name, max_level] --> list create
        counter = 0
        for enchant in final_list:
            model.append([counter, enchant, enchants[enchant]['MaxLevel']])
            counter += 1

        # [raw_meterial_1, raw_meterial_2, raw_meterial_3 ...] --> list create
        if ('RawMaterials' in items[id]):
            raw_meterials = items[id]['RawMaterials']

        # Fetch image path from JSON file
        image_path = item_details[id]['ImagePath']

        # sessions and session settings
        session['raw_meterials'] = raw_meterials
        session['image_path'] = image_path
        session['model'] = model
        session['item'] = id

    return redirect(url_for('generate_code', id=id))


@app.route('/code/<string:id>')
@item_required
@model_required
def generate_code(id):
    raw_meterials = session['raw_meterials']
    image_path = session['image_path']
    model = session['model']
    return render_template('code_generate.html', model=model, item=id, path=image_path, meterials=raw_meterials)


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html')


if __name__ == '__main__':
    app.run(debug=True)
