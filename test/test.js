require('../config');
const request = require ('supertest-as-promised');
const expect = require ('chai').expect;
const atob = require ('atob');
const btoa = require ('btoa');
const isBase64 = require ('is-base64');
const isUtf8 = require ('is-utf8');
const fs = require ('fs');
const sha512 = require ('js-sha512');
const exec = require ('child_process').exec;
const baseUrl = 'http://localhost:8088';
const hash = '6YBCdCn+2D898JEdEAMaVLIj8gXJTB3xkIfu7GgqY1zD8szlBAla5Lq8+FE5QkgfkgPQ8M2nVW4+lcf86thQqA==';

describe('/hash/:jobId', () => {

    describe('GET - Retrieves Password Hash', () => {

        before((done) => {
            exec(server);
            request(baseUrl)
                .post('/hash')
                .set('Content-Type', 'application/json')
                .send({ "password": "angrymonkey" })
                .expect(200)
                .end((err,res) => {
                    if(err) return done(err);
                    done();
                });
        });

        after((done) => {
            request(baseUrl)
                .post('/hash')
                .set('Content-Type', 'text/plain')
                .send('shutdown')
                .end((err,res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Minimum Valid Request', (done) => {
            request(baseUrl)
                .get('/hash/1')
                .expect(200)
                .expect(hash)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Returns Any Base64 Encoded Charset', (done) => {
            request(baseUrl)
                .get('/hash/1')
                .expect(200)
                .expect(() => {
                    expect(isBase64(hash)).to.equal(true);
                })
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Returns Base64 Encoded UTF-8 Charset', (done) => {
            request(baseUrl)
                .get('/hash/1')
                .expect(200)
                .expect(() => {
                    fs.writeFileSync('./test/isUtf8.txt', atob(hash));
                    let myHash = fs.readFileSync('./test/isUtf8.txt');
                    expect(isUtf8(myHash)).to.equal(true);
                })
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Returns Base64 Encoded 512-bit Charset', (done) => {
            let testHash = atob(hash);
            let hashBitSize = testHash.length * 8;
            request(baseUrl)
                .get('/hash/1')
                .expect(200)
                .expect(() => {
                    expect(hashBitSize).to.equal(512);
                })
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Returns Base64 Encoded SHA512 Hash', (done) => {
            let password = 'angrymonkey';
            let passwordHash = sha512(password);
            let base64Hash = atob(passwordHash);
            request(baseUrl)
                .get('/hash/1')
                .expect(200)
                .expect((res) => {
                    let testHash = atob(res.text);
                    let sha512Hash = sha512(testHash);
                    expect(passwordHash).to.equal(testHash);
                    expect(base64Hash).to.equal(sha512Hash);
                })
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('With Simultaneous Requests', (done) => {
            request(baseUrl)
                .get('/hash/1')
                .expect(200)
                .end((err,res) => {
                    if(err) return done(err);
                });
            request(baseUrl)
                .get('/hash/1')
                .expect(200)
                .end((err,res) => {
                    if(err) return done(err);
                });
            request(baseUrl)
                .get('/hash/1')
                .expect(200)
                .end((err,res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Fails Gracefully When :jobId Does Not Exist', (done) => {
            request(baseUrl)
                .get('/hash/0')
                .expect(400)
                .expect((res) => {
                    expect(res.text).to.equal('Hash not found\n');
                })
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Fails Gracefully When Query Params Present', (done) => {
            request(baseUrl)
                .get('/hash/0' + '?query_param=present')
                .expect(400)
                .expect((res) => {
                    expect(res.text).to.equal('Hash not found\n');
                })
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('METHOD: POST Should Fail', (done) => {
            request(baseUrl)
                .post('/hash/1')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('METHOD: PUT Should Fail', (done) => {
            request(baseUrl)
                .put('/hash/1')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('METHOD: PATCH Should Fail', (done) => {
            request(baseUrl)
                .patch('/hash/1')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('METHOD: DELETE Should Fail', (done) => {
            request(baseUrl)
                .delete('/hash/1')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('METHOD: COPY Should Fail', (done) => {
            request(baseUrl)
                .copy('/hash/1')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('METHOD: HEAD Should Fail', (done) => {
            request(baseUrl)
                .head('/hash/1')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('METHOD: OPTIONS Should Fail', (done) => {
            request(baseUrl)
                .options('/hash/1')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('METHOD: LOCK Should Fail', (done) => {
            request(baseUrl)
                .lock('/hash/1')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('METHOD: UNLOCK Should Fail', (done) => {
            request(baseUrl)
                .unlock('/hash/1')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });
    });
});

describe( '/hash ', () => {

    describe( 'POST - Hash Creation', () => {
        let jobId = 0;

        before((done) => {
            exec(server, done());
        });

        after((done) => {
            request(baseUrl)
                .post('/hash')
                .set('Content-Type', 'text/plain')
                .send('shutdown')
                .end((err,res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Minimum Valid Request', (done) => {
             request(baseUrl)
                .post('/hash')
                .set('Content-type', 'application/json')
                .send({ "password": "angrymonkey" })
                .expect(200)
                .expect((res)=> {
                    jobId++;
                    expect(res.text).to.equal(jobId.toString());
                })
                .end((err,res) => {
                    if (err) return done(err);
                    done();
                });
        });
        
        it('In No Less Than 5000 Milliseconds', (done) => {
            let sendDate = (new Date()).getTime();
            request(baseUrl)
                .post('/hash')
                .set('Content-Type', 'application/json')
                .send({ "password": "angrymonkey" })
                .expect(200)
                .expect((res)=> {
                    jobId++;
                    expect(res.text).to.equal(jobId.toString());
                })
                .expect(() => {
                    let receivedDate = (new Date()).getTime();
                    let responseTime = receivedDate - sendDate;
                    expect(responseTime).to.be.above(5000);
                    })
                .end((err,res) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('With Simultaneous Requests', (done) => {
            let sendDate1 = (new Date()).getTime();
            request(baseUrl)
                .post('/hash')
                .set('Content-type', 'application/json')
                .send({ "password": "baby_wizard"})
                .expect(200)
                .expect((res) => {
                    let receivedDate1 = (new Date()).getTime();
                    let responseTime1 = receivedDate1 - sendDate1;
                    expect(responseTime1).to.be.above(5000);
                })
                .end((err,res)=> {
                    if(err) return done(err);
                });
        
            let sendDate2 = (new Date()).getTime();
            request(baseUrl)
                .post('/hash')
                .set('Content-type', 'application/json')
                .send({ "password": "baby_wizard"})
                .expect(200)
                .expect((res) => {
                    let receivedDate = (new Date()).getTime();
                    let responseTime2 = receivedDate - sendDate2;
                    expect(responseTime2).to.be.above(5000);
                })
                .end((err,res)=> {
                    if(err) return done(err);
                    done();
                });
        });

        it('With Simultaneous Requests: Concurrent Processing', (done) => {
            let sendDate1 = (new Date()).getTime();
            request(baseUrl)
                .post('/hash')
                .set('Content-type', 'application/json')
                .send({ "password": "baby_wizard"})
                .expect(200)
                .expect((res) => {
                    let receivedDate1 = (new Date()).getTime();
                    let responseTime1 = receivedDate1 - sendDate1;
                    expect(responseTime1).to.be.above(5000);
                })
                .end((err,res)=> {
                    if(err) return done(err);
                });
        
            let sendDate2 = (new Date()).getTime();
            request(baseUrl)
                .post('/hash')
                .set('Content-type', 'application/json')
                .send({ "password": "baby_wizard"})
                .expect(200)
                .expect((res) => {
                    let receivedDate = (new Date()).getTime();
                    let responseTime2 = receivedDate - sendDate2;
                    expect(responseTime2).to.be.above(5000);
                    expect(responseTime2).to.be.below(6000);
                })
                .end((err,res)=> {
                    if(err) return done(err);
                    done();
                });
        });
    
        it('Missing Headers Should Fail', (done) => {
            let sendDate = (new Date()).getTime();
            request(baseUrl)
                .post('/hash')
                .send({ "password": "angrymonkey" })
                .expect(415)
                .end((err,res) => {
                    if (err) return done(err);
                    done();
                });
        });
    
        it('Incorrect Content-Type: application/octet-stream Should Fail', (done) => {
            request(baseUrl)
                .post('/hash')
                .set('Content-Type', 'application/octet-stream')
                .send('Y▒\\▒?▒▒\'▒4▒x~▒')
                .expect(415)
                .end((err,res) => {
                    if (err) return done(err);
                    done();
                });
        });
    
        it('Incorrect Content-Type: application/gibberish Should Fail', (done) => {
            request(baseUrl)
                .post('/hash')
                .set('Content-Type', 'application/gibberish')
                .send('sdfgdf gdhfg hf ;')
                .expect(415)
                .end((err,res) => {
                    if (err) return done(err);
                    done();
                });
        });
    
        it('Password Is NULL Should Fail', (done) => {
            request(baseUrl)
                .post('/hash')
                .set('Content-type', 'application/json')
                .send({ "password": null })
                .expect(415)
                .end((err,res) => {
                    if (err) return done(err);
                    done();
                });
        });
    
        it('Password Is Empty String Should Fail', (done) => {
            request(baseUrl)
                .post('/hash')
                .set('Content-type', 'application/json')
                .send({ "password": "" })
                .expect(400)
                .end((err,res) => {
                    if (err) return done(err);
                    done();
                }) ;
        });
    
        it('Password Is Number Should Fail', (done) => {
            request(baseUrl)
                .post('/hash')
                .set('Content-type', 'application/json')
                .send({ "password": 123 })
                .expect(400)
                .expect('Malformed Input\n')
                .end((err,res) => {
                    if (err) return done(err);
                    done();
                });
        });
    
        it('Password Is Boolean Should Fail', (done) => {
            request(baseUrl)
                .post('/hash')
                .set('Content-type', 'application/json')
                .send({ "password": true })
                .expect(400)
                .expect('Malformed Input\n')
                .end((err,res) => {
                    if (err) return done(err);
                    done();
                });
        });
    
        it('Empty Request Body Should Fail', (done) => {
            request(baseUrl)
                .post('/hash')
                .set('Content-type', 'application/json')
                .send({ })
                .expect(415)
                .expect('Malformed Input\n')
                .end((err,res) => {
                    if (err) return done(err);
                    done();
                });
        });
    
        it('Missing Password Field without JSON header Should Fail', (done) => {
            request(baseUrl)
                .post('/hash')
                .send({ "not_password": "not my pasword broh"})
                .expect(400)
                .expect('Password Field Required\n')
                .end((err,res) => {
                    if (err) return done(err);
                    done();
                });
        });
    
        it('Missing Password Field Should Fail', (done) => {
            request(baseUrl)
                .post('/hash')
                .set('Content-type', 'application/json')
                .send({ "not_password": "not my pasword broh"})
                .expect(415)
                .expect('Malformed Input\n')
                .end((err,res) => {
                    if (err) return done(err);
                    done();
                });
        });
    
        it('With Query Parameters Should Fail', (done) => {
            request(baseUrl)
                .post('/hash' + '?query_param=true')
                .set('Content-type', 'application/json')
                .send({ "password": "timmaaaay!!"})
                .expect(400)
                .end((err,res) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('METHOD: GET Should Fail', (done) => {
            request(baseUrl)
                .get('/hash')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('METHOD: PUT Should Fail', (done) => {
            request(baseUrl)
                .put('/hash')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('METHOD: PATCH Should Fail', (done) => {
            request(baseUrl)
                .patch('/hash')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('METHOD: DELETE Should Fail', (done) => {
            request(baseUrl)
                .delete('/hash')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('METHOD: COPY Should Fail', (done) => {
            request(baseUrl)
                .copy('/hash')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('METHOD: HEAD Should Fail', (done) => {
            request(baseUrl)
                .head('/hash')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('METHOD: OPTIONS Should Fail', (done) => {
            request(baseUrl)
                .options('/hash')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('METHOD: LOCK Should Fail', (done) => {
            request(baseUrl)
                .lock('/hash')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('METHOD: UNLOCK Should Fail', (done) => {
            request(baseUrl)
                .unlock('/hash')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });
    });

    describe('POST - Shutdown', () => {
        beforeEach((done) => {
            exec(server, done());
        });

        it('Minimum Valid Request', (done) => {
            request(baseUrl)
                .post('/hash')
                .set('Content-Type', 'text/plain')
                .send('shutdown')
                .expect(200)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });
    });
});

describe('/stats', () => {
    
    describe('GET - Retrieve Request Stats', () => {
        let totalRequests = 0;
        let totalTime = 0;

        before((done) => {
            exec(server,done());
        });

        beforeEach((done) => {
            let sendDate = (new Date()).getTime();
            request(baseUrl)
                .post('/hash')
                .set('Content-Type', 'application/json')
                .send({ "password": "angrymonkey" })
                .expect(200)
                .expect((res) => {
                    let receivedDate = (new Date()).getTime();
                    let responseTime = receivedDate - sendDate;
                    totalTime += responseTime;
                })
                .end((err,res) => {
                    if(err) return done(err);
                    totalRequests++;
                    done();
                });
        });

        after((done) => {
            request(baseUrl)
                .post('/hash')
                .set('Content-Type', 'text/plain')
                .send('shutdown')
                .end((err,res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Minimum Valid Request', (done) => {
            request(baseUrl)
                .get('/stats')
                .expect(200)
                .expect((res) => {
                    let averageTime = totalTime / totalRequests;
                    expect(res.text).to.equal('{"TotalRequests":' + totalRequests + ',"AverageTime":' + Math.floor(averageTime) + '}');
                })
                .end((err,res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Returns application/json', (done) => {
            request(baseUrl)
                .get('/stats')
                .expect(200)
                .expect((res) => {
                    expect(res.type).to.equal('application/json');
                })
                .end((err,res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Returns Stats After Sanitizing Query Param', (done) => {
            request(baseUrl)
                .get('/stats' + '?query_param=true')
                .expect(200)
                .end((err,res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('With Simultaneous Requests', (done) => {
            request(baseUrl)
                .get('/stats')
                .expect(200)
                .end((err,res) => {
                    if(err) return done(err);
                });

            request(baseUrl)
                .get('/stats')
                .expect(200)
                .end((err,res) => {
                    if(err) return done(err);
                });

            request(baseUrl)
                .get('/stats')
                .expect(200)
                .end((err,res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('METHOD: POST Should Fail', (done) => {
            request(baseUrl)
                .post('/stats')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('METHOD: PUT Should Fail', (done) => {
            request(baseUrl)
                .put('/stats')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('METHOD: PATCH Should Fail', (done) => {
            request(baseUrl)
                .patch('/stats')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('METHOD: DELETE Should Fail', (done) => {
            request(baseUrl)
                .delete('/stats')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('METHOD: COPY Should Fail', (done) => {
            request(baseUrl)
                .copy('/stats')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('METHOD: HEAD Should Fail', (done) => {
            request(baseUrl)
                .head('/stats')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('METHOD: OPTIONS Should Fail', (done) => {
            request(baseUrl)
                .options('/stats')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('METHOD: LOCK Should Fail', (done) => {
            request(baseUrl)
                .lock('/stats')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('METHOD: UNLOCK Should Fail', (done) => {
            request(baseUrl)
                .unlock('/stats')
                .expect(405)
                .end((err, res) => {
                    if(err) return done(err);
                    done();
                });
        });

        it('Returns Accurate Stats After All Requests', (done) => {
            request(baseUrl)
                .get('/stats')
                .expect(200)
                .expect((res) => {
                    let averageTime = totalTime / totalRequests;
                    expect(res.text).to.equal('{"TotalRequests":' + totalRequests + ',"AverageTime":' + Math.floor(averageTime) + '}');
                })
                .end((err,res) => {
                    if(err) return done(err);
                    done();
                });
        });
    });
});