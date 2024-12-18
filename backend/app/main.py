from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow_sqlalchemy.fields import Nested


app = Flask(__name__)

CORS(
    app,
    resources={r"/*": {"origins": ["http://localhost:5173"]}},
)

# Configure the MySQL database connection
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "mysql+pymysql://user:password@localhost:3306/db"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)

    data = db.Column(db.String(120), nullable=True, default=None)

    children = db.relationship("Tag", backref=db.backref("parent", remote_side=[id]))
    parent_id = db.Column(db.Integer, db.ForeignKey("tag.id"), nullable=True)

    def __repr__(self):
        return f"<Tag {self.name}>"


class TagSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Tag
        include_relationships = True
        load_instance = True
        fields = ("id", "name", "data", "children")

    children = Nested("TagSchema", many=True)

    def remove_null_and_empty(self, data):
        if data.get("data") is None:
            data.pop("data", None)
        if data.get("children") == []:
            data.pop("children", None)
        return data

    def dump(self, obj, many=None, **kwargs):
        data = super().dump(obj, many=many, **kwargs)
        if many:
            return [self.remove_null_and_empty(item) for item in data]
        return self.remove_null_and_empty(data)


with app.app_context():
    db.create_all()
    if Tag.query.count() == 0:
        root_tag = Tag(name="root")
        db.session.add(root_tag)
        db.session.commit()


# get all tags at the root level
@app.route("/tag", methods=["GET"])
def get_tags():
    tags = Tag.query.filter_by(parent_id=None).first()

    tags_json = TagSchema(many=False).dump(tags)

    return tags_json


# post request to create a new tag
@app.route("/tag", methods=["POST"])
def create_tag():
    data = request.get_json()
    parent_id = data.get("parent_id")

    if parent_id is None:
        return {"error": "parent_id is required"}, 400

    parent = Tag.query.get(parent_id)

    if parent is None:
        return {"error": "parent not found"}, 404

    if parent.data is not None:
        parent.data = None

    name = ""
    if parent.name == "root":
        name = f"child{len(parent.children)+1}"
    else:
        name = f"{parent.name}-child{len(parent.children)+1}"

    new_tag = Tag(name=name, parent_id=parent_id)
    db.session.add(new_tag)
    db.session.commit()

    return {"id": "dasd"}


# get all children of a tag
@app.route("/tag/<int:id>/children", methods=["GET"])
def get_children(id):
    tag = Tag.query.get(id)
    children = tag.children
    return {"children": [child.name for child in children]}


# add data to a tag
@app.route("/tag/<int:id>/data", methods=["POST"])
def add_data(id):
    data = request.get_json()
    tag = Tag.query.get(id)
    tag.data = data.get("data")
    db.session.commit()
    return {"data": tag.data}


if __name__ == "__main__":
    app.run()
