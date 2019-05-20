const chai = require("chai");
const chaiHttp = require("chai-http");
const { app } = require("../app");

chai.should();
chai.use(chaiHttp);

describe("alers_ test", () => {
  it("should list a single alert on /v1/alerts/<id>", done => {
    chai
      .request(app)
      .get("/v1/alerts/00dd5c60-7b09-11e9-ab44-d305f32f2e5a")
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        done();
      });
  });

  it("should list a unknow alert on /v1/alerts/<id>", done => {
    chai
      .request(app)
      .get("/v1/alerts/4befvvfea2ea0-6ff5-11e9-adbb-cddddd521467f9031")
      .end((err, res) => {
        res.should.have.status(404);
        res.should.be.json;
        done();
      });
  });

  it("should list one or  a multiple alerts that have the status on /v1/alerts/search/<status></status>", done => {
    chai
      .request(app)
      .get("/v1/alerts/search/risk,danger")
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        done();
      });
  });

  it("should list one or  a multiple alerts with wrong status on /v1/alerts/search/<status", done => {
    chai
      .request(app)
      .get("/v1/alerts/search/dangerovvus,rdscsisk")
      .end((err, res) => {
        res.should.have.status(400);
        res.should.be.json;
        done();
      });
  });

  it("should add a new alert on /v1/alerts", done => {
    chai
      .request(app)
      .post("/v1/alerts/")
      .send({
        type: "weather",
        label: "alert-test",
        status: "risk,danger",
        from: "monday",
        to: "friday"
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a("object");
        done()
      })
      
  });

  it("should add a wrong alert on /v1/alerts", done => {
    chai
      .request(app)
      .post("/v1/alerts/")
      .send({
        type: "weather",
        label: "alert-test",
        stddatus: "risk,danger",
        from: "monday",
        wrongto: "friday"
      })
      .end((err, res) => {
        res.should.have.status(405);
        res.should.be.json;
        res.body.should.be.a("object");
        done()
      })
      
  });

  it("should add a null alert on /v1/alerts", done => {
    chai
      .request(app)
      .post("/v1/alerts/")
      .send({
      })
      .end((err, res) => {
        res.should.have.status(405);
        res.should.be.json;
        res.body.should.be.a("object");
        done()
      })
      
  });
  it("should update a specific alert on /v1/alerts/<id>", done => {
    chai
      .request(app)
      .patch("/v1/alerts/1664cb50-7b08-11e9-a643-b72c1123386b")
      .send({
        to: "sunday"
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a("object");
        done()
      })
      
  });



  it("should update a specific alert with wrong parameters on /v1/alerts/<id>", done => {
    chai
      .request(app)
      .patch("/v1/alerts/1664cb50-7b08-11e9-a643-b72c1123386b")
      .send({
        wrongparameter: "sunday"
      })
      .end((err, res) => {
        res.should.have.status(405);
        res.should.be.json;
        res.body.should.be.a("object");
        done()
      })
      
  });

  it("should update a wrong alert with wrong id on /v1/alerts/<id>", done => {
    chai
      .request(app)
      .patch("/v1/alerts/4bea2eavefvedfevvefvefveddf5-11e9-adbb-c5vev21467f9031")
      .send({
        to: "sunday"
      })
      .end((err, res) => {
        res.should.have.status(404);
        res.should.be.json;
        res.body.should.be.a("object");
        done()
      })
      
  });

  // before run this test be sure that the alert is in the database
 /* it("should remove a specific alert on /v1/alerts/<id>", done => {
    chai
      .request(app)
      .delete("/v1/alerts/00dd5c60-7b09-11e9-ab44-d305f32f2e5a")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });*/
  
  it("should remove a unknow alert on /v1/alerts/<id>", done => {
    chai
      .request(app)
      .delete("/v1/alerts/733fba40-7b05-11e9-910c-5sdsljl15ddbbb91e9")
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("should remove a null id alert on /v1/alerts/<id>", done => {
    chai
      .request(app)
      .delete("/v1/alerts/")
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
});
