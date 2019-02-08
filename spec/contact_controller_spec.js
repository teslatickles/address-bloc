const ContactController = require("../controllers/ContactController");
const sequelize = require('../db/models/index').sequelize;

describe("ContactController", () => {
    beforeEach((done) => {
        this.book = new ContactController();

        sequelize.sync({ force: true }).then((res) => {
            done();
        })
            .catch((err) => {
                console.log(err);
                done();
            });
    });
    it("shouldBeDefined", () => {
        expect(ContactController).toBeDefined();
    });

    describe("#addContact()", () => {
        it("should add a single contact into the book", (done) => {
            this.book.addContact("Lemon", "001-101-1010", "lemon@email.com")
                .then((contact) => {
                    expect(contact.name).toBe("Lemon");
                    expect(contact.phone).toBe("001-101-1010");
                    expect(contact.email).toBe("lemon@email.com")
                    done();
                })
                .catch((err) => {
                    done();
                });
        });
    });
    describe("#getContacts()", () => {
        it("should return an empty array when no contacts are available", (done) => {
            this.book.getContacts()
                .then((contacts) => {
                    expect(contacts.length).toBe(0);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
        });

        it("should return an array of contacts when contacts are available", () => {
            this.book.addContact("Lemon Lane", "010-001-0001", "lemon@email.com")
                .then(() => {
                    this.book.getContacts()
                        .then((contacts) => {
                            expect(contacts.length).toBe(1);
                            done();
                        });
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
        });
    });
    describe("#search_methods()", () => {

        const zelda = ["Zelda Smith", "000-100-111", "zelda@nintendo.com"];
        const snake = ["Solid Snake", "100-100-100", "snake@konamiBakka.com"];
        const magus = ["Magus Johnson", "101-010-101", "magus@squaresoft.com"];
        const suikoden = ["Suikoden Great", "111-111-111", "suikoden@sugoi.com"];

        describe("#iterativeSearch()", () => {

            it("should return null when called with an empty array", () => {
                expect(this.book.iterativeSearch([], "Solid")).toBeNull();
            });

            it("should return null when contact is not found", (done) => {
                this.book.addContact(...zelda)
                    .then(() => {
                        this.book.getContacts()
                            .then((contacts) => {
                                expect(this.book.iterativeSearch(contacts, "Suikoden Great")).toBeNull();
                                done();
                            })
                            .catch((err) => {
                                console.log(err);
                                done();
                            });
                    });
            });

            it("should return the contact if found", (done) => {
                this.book.addContact(...suikoden)
                    .then(() => {
                        this.book.addContact(...snake)
                            .then(() => {
                                this.book.getContacts()
                                    .then((contacts) => {
                                        let contact = this.book.iterativeSearch(contacts, "Solid Snake");
                                        expect(contact.name).toBe("Solid Snake");
                                        expect(contact.phone).toBe("100-100-100");
                                        expect(contact.email).toBe("snake@konamiBakka.com");
                                        done();
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        done();
                                    });
                            });
                    });
            });
        });

        describe("#binarySearch()", () => {
            function sort(contacts) {
                return contacts.sort((a, b) => {
                    if (a.name > b.name) return 1;
                    else if (a.name < b.name) return -1;
                    else return 0;
                });
            }

            it("should return null when called with an empty array", () => {
                expect(this.book.binarySearch([], "Magus Johnson")).toBeNull();
            });

            it("should return null when contact is not found", (done) => {
                this.book.addContact(...zelda)
                    .then(() => {
                        this.book.getContacts()
                            .then((contacts) => {
                                expect(this.book.binarySearch(sort(contacts), "Magus Johnson")).toBeNull();
                                done();
                            })
                            .catch((err) => {
                                console.log(err);
                                done();
                            });
                    })
            });

            it("should return the contact if found", (done) => {
                this.book.addContact(...suikoden).then(() => {
                    this.book.addContact(...magus).then(() => {
                        this.book.addContact(...zelda).then(() => {
                            this.book.addContact(...snake).then(() => {
                                this.book.getContacts().then((contacts) => {
                                    let contact = this.book.binarySearch(sort(contacts), "Magus Johnson");
                                    expect(contact.name).toBe("Magus Johnson");
                                    expect(contact.phone).toBe("101-010-101");
                                    expect(contact.email).toBe("magus@squaresoft.com");
                                    done();
                                })
                                    .catch((err) => {
                                        console.log(err);
                                        done();
                                    });
                            });
                        });
                    });
                });
            });
        });
        describe("#search()", () => {
            it("should return null when a contact was not found", (done) => {
                this.book.addContact(...zelda)
                    .then(() => {
                        this.book.search("Solid Snake")
                            .then((contact) => {
                                expect(contact).toBeNull();
                                done();
                            })
                            .catch((err) => {
                                console.log(err);
                                done();
                            });
                    });
            });

            it("should return the contact when found", (done) => {
                this.book.addContact(...snake)
                    .then(() => {
                        this.book.search("Solid Snake")
                            .then((contact) => {
                                expect(contact).not.toBeNull();
                                expect(contact.name).toBe("Solid Snake");
                                expect(contact.phone).toBe("100-100-100");
                                expect(contact.email).toBe("snake@konamiBakka.com");
                                done();
                            })
                            .catch((err) => {
                                console.log(err);
                                done();
                            });
                    });
            });
        });
    });
    describe("#delete", () => {
        it("should not remove any contacts that do not match the ID passed", (done) => {
            this.book.addContact("Captain Picard", "000-000-000", "null@null.com")
                .then(() => {
                    this.book.getContacts()
                        .then((contacts) => {
                            expect(contacts[0].name).toBe("Captain Picard");
                            expect(contacts.length).toBe(1);
                            this.book.delete(99)
                                .then(() => {
                                    this.book.getContacts()
                                        .then((contacts) => {
                                            expect(contacts.length).toBe(1);
                                            done();
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                            done();
                                        });
                                });
                        });
                });
        });

        it("should remove the contact that matches the ID passed", (done) => {
            this.book.addContact("Captain Picard", "000-000-000", "null@null.com").then((contact) => {
                this.book.getContacts()
                    .then((contacts) => {
                        expect(contacts[0].name).toBe("Captain Picard");
                        expect(contacts.length).toBe(1);
                        this.book.delete(contact.id)
                            .then(() => {
                                this.book.getContacts()
                                    .then((contacts) => {
                                        expect(contacts.length).toBe(0);
                                        done();
                                    });
                            });
                    });
            });
        });
    });
});
