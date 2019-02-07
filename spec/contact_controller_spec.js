const ContactController = require("../controllers/ContactController");
const sequelize = require('../db/models/index').sequelize;

describe("ContactController", () => {
    beforeEach((done) => {
        this.book = new ContactController();

        sequelize.sync({ force: true }).then((res) => {
            done();
        })
            .catch((err) => {
                done();
            });
    });
    it("shouldBeDefined", () => {
        expect(ContactController).toBeDefined();
    });

    describe("#addContact()", () => {
        it("should add a single contact into the book", (done) => {
            this.book.addContact("Lemon", "001-101-1010")
                .then((contact) => {
                    expect(contact.name).toBe("Lemon");
                    expect(contact.phone).toBe("001-101-1010");
                    done();
                })
                .catch((err) => {
                    done();
                });
        });
    });
});

