import os
from flask import Flask, send_from_directory

DIST_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")

app = Flask(__name__, static_folder=DIST_DIR, static_url_path="")


@app.route("/")
def index():
    return send_from_directory(DIST_DIR, "index.html")


@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(DIST_DIR, path)


if __name__ == "__main__":
    app.run(port=5000)
