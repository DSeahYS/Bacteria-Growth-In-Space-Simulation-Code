from flask import Flask, render_template

# Initialize Flask app
app = Flask(__name__)

# Route for the first table
@app.route('/')
def show_table():
    return render_template('table.html')  # This renders 'table.html' from the 'templates' folder

# Route for the new detection methods table
@app.route('/detection-methods')
def detection_methods():
    return render_template('detection_methods.html')  # This renders 'detection_methods.html' from the 'templates' folder

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
