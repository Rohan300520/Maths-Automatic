from flask import Flask 
from flask import redirect, make_response, request
from flask import render_template
from mathreader import api
import os
import inspect
import json
import cv2
from flask import Flask, render_template, request, jsonify
import wolframalpha
import sys
import xml.etree.ElementTree as ET

app = Flask(__name__)
app.secret_key = "1234"
app.config['WOLFRAMALPHA_APP_ID'] = 'your_wolfram_alpha_api_key'

BASE_PATH = os.path.dirname(os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe()))))
users = {
    "rohan": "123",
    "abc":"321"
}
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/', methods = ["GET","POST"])
def index():
    return render_template("front_page.html")


@app.route('/query', methods=['POST'])
def query():
    app_id = app.config['WOLFRAMALPHA_APP_ID']
    if not app_id:
        return jsonify({'error': 'Please provide a valid Wolfram Alpha app ID.'})

    client = wolframalpha.Client(app_id)

    user_query = request.form['query']
    print(user_query, file=sys.stderr)
    if "\\f" in user_query:
        print(True,file=sys.stderr)
    if not user_query:
        return jsonify({'error': 'No query provided.'})

    try:
        res = client.query(user_query, format='image')

        # Create the XML response
        root = ET.Element('response')

        for pod in res.pods:
            pod_xml = ET.SubElement(root, 'pod')
            pod_xml.attrib['title'] = pod.title

            if has_image(pod):
                pod_xml.attrib['type'] = 'image'
                img_xml = ET.SubElement(pod_xml, 'img')
                img_xml.attrib['src'] = get_image_url(pod.subpods)
            else:
                pod_xml.text = pod.text

        # Convert the XML response to string
        xml_string = ET.tostring(root, encoding='utf-8').decode('utf-8')
        print(xml_string, file=sys.stderr)
        return jsonify({'xml': xml_string})
    except Exception as e:
        return jsonify({'error': 'Error occurred while processing the query: ' + repr(e)})


def has_image(pod):
    for subpod in pod.subpods:
        if subpod.img:
            return True
    return False


def get_image_url(subpods):
    for subpod in subpods:
        if subpod.img:
            return subpod.img['@src']
    return None

@app.route('/ajax/recognize', strict_slashes=False, methods = ['POST', 'OPTIONS'])
def recognize():

    latex = ""
    error = False

    try:

        data = request.get_json()
        img_data = data['image']
        img_data = img_data.split(',')[1]

        hme_recognizer = api.HME_Recognizer()
        hme_recognizer.load_image(img_data)
        latex, modified_img = hme_recognizer.recognize()
        hme_recognizer = None

    except Exception as e:
        if hasattr(e, 'data'):
            if 'latex_string_original' in e.data:
                latex = e.data['latex_string_original']
                error = True
            print(e.data)

    return json.dumps({
        'latex': latex,
        'error': error,
    })
 
@app.route('/solution')
def solution():
    return render_template('solution.html')

@app.route('/arithmatic')
def arithmatic():
    return render_template('arithmatic.html')

@app.route('/algebra')
def algebra():
    return render_template('algebra.html')

@app.route('/calculus')
def calculus():
    return render_template('calculus.html')

@app.route('/differentiation')
def differentiation():
    return render_template('differentiation.html')
    
@app.route('/descretemath')
def descretemath():
    return render_template('descretemath.html')
 
@app.route('/geometry')
def geometry():
    return render_template('geometry.html')

@app.route('/linearalgebra')
def linearalgebra():
    return render_template('linearalgebra.html')
    
@app.route('/statistics')
def statistics():
    return render_template('statistics.html')
    
@app.route('/proofs')
def proofs():
    return render_template('proofs.html')
def write_show_image(img, name):
    cv2.imwrite('%s.jpg' % name, img)
    cv2.imshow('Image', img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

if __name__=='__main__':    
    app.run(debug=True)
