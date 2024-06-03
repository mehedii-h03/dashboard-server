require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3005;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middlewears
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6dgrwby.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        //collections 
        const projectsCollection = client.db("portfolio").collection("projects");
        const blogsCollection = client.db("portfolio").collection("blogs");
        const usersCollection = client.db("portfolio").collection("user");

        // Get Apis

        //All News
        app.get("/projects", async (req, res) => {
            const result = await projectsCollection.find().toArray();
            res.send(result);
        });

        app.get("/blogs", async (req, res) => {
            const result = await blogsCollection.find().toArray();
            res.send(result);
        });

        //Single
        app.get("/projects/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await projectsCollection.find(filter).toArray();
            res.send(result);
        });

        app.get("/blogs/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await projectsCollection.find(filter).toArray();
            res.send(result);
        });

        //Post Api
        app.post("/add-project", async (req, res) => {
            const projectInfo = req.body;
            const result = await projectsCollection.insertOne(projectInfo);
            res.send(result);
        })

        app.post("/add-blog", async (req, res) => {
            const blogInfo = req.body;
            const result = await blogsCollection.insertOne(blogInfo);
            res.send(result);
            console.log(result);
        })

        //edit
        app.put("/projects/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const option = { upsert: true }
            const updatedProject = req.body;
            const project = {
                $set: {
                    name: updatedProject.name,
                    image: updatedProject.image,
                    liveLink: updatedProject.liveLink,
                    githubLink: updatedProject.githubLink,
                    description: updatedProject.description,
                    features: updatedProject.features,
                    techs: updatedProject.techs,
                }
            }
            const result = await projectsCollection.updateOne(filter, project, option);
            res.send(result);
        })

        //Delete Api
        app.delete('/projects/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await projectsCollection.deleteOne(query);
            res.send(result);
        })

        app.delete('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await blogsCollection.deleteOne(query);
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Server is running");
});

app.listen(port, () => {
    console.log(`Server is running on${port}`);
});