"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.CreateInitialTables1649277945107 = void 0;
var CreateInitialTables1649277945107 = /** @class */ (function () {
    function CreateInitialTables1649277945107() {
    }
    CreateInitialTables1649277945107.prototype.up = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.query("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n        CREATE TABLE IF NOT EXISTS venues (\n            id serial PRIMARY KEY,\n            name VARCHAR (128) NOT NULL,\n            capacity INT NOT NULL\n        );\n    ")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n        CREATE TABLE IF NOT EXISTS addresses (\n            id SERIAL PRIMARY KEY,\n            zip VARCHAR (6) UNIQUE NOT NULL,\n            street VARCHAR (128) NOT NULL,\n            city VARCHAR (32) NOT NULL,\n            venue_id INT UNIQUE NOT NULL,\n            FOREIGN KEY (venue_id) REFERENCES venues (id) ON DELETE CASCADE\n        );\n    ")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n        CREATE TABLE IF NOT EXISTS events (\n            id serial PRIMARY KEY,\n            venue_id INT NOT NULL,\n            name varchar (64) NOT NULL,\n            duration SMALLINT NOT NULL,\n            event_date TIMESTAMP NOT NULL,\n            description varchar (256) NOT NULL,\n            FOREIGN KEY (venue_id) REFERENCES venues (id) ON DELETE CASCADE\n        );\n    ")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n        CREATE TABLE IF NOT EXISTS seat_structures (\n            id serial PRIMARY KEY,\n            row_no SMALLINT NOT NULL,\n            column_no VARCHAR(1) NOT NULL,\n            last_seat_in_row BOOLEAN NOT NULL,\n            sign VARCHAR (4) NOT NULL,\n            venue_id INT NOT NULL,\n            FOREIGN KEY (venue_id) REFERENCES venues (id) ON DELETE CASCADE ON UPDATE CASCADE,\n            UNIQUE (venue_id, sign)\n        );\n    ")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TYPE ReservationStatus AS ENUM ('PENDING_PAYMENT', 'EXPIRED', 'APPROVED')")];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n        CREATE TABLE IF NOT EXISTS reservations (\n            id serial PRIMARY KEY,\n            event_id INT NOT NULL,\n            status ReservationStatus NOT NULL DEFAULT 'PENDING_PAYMENT',\n            booking_reference uuid NOT NULL DEFAULT uuid_generate_v4(),\n            created_at TIMESTAMP NOT NULL,\n            deadline TIMESTAMP NOT NULL\n        );\n    ")];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n        CREATE TABLE IF NOT EXISTS customers (\n            id serial PRIMARY KEY,\n            first_name VARCHAR (64) NOT NULL,\n            last_name VARCHAR (64) NOT NULL,\n            email VARCHAR (128),\n            seat_id INT NOT NULL,\n            reservation_id INT NOT NULL,\n            FOREIGN KEY (reservation_id) REFERENCES reservations (id),\n            FOREIGN KEY (seat_id) REFERENCES seat_structures (id),\n            UNIQUE (seat_id, reservation_id)\n        );\n    ")];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n        CREATE TABLE IF NOT EXISTS tickets (\n            id serial PRIMARY KEY,\n            issued BOOLEAN NOT NULL,\n            ticket_number VARCHAR (32) NOT NULL,\n            price NUMERIC (7, 2) NOT NULL,\n            event_id INT NOT NULL,\n            customer_id INT,\n            reservation_id INT,\n            seat_id INT NOT NULL,\n            FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE ON UPDATE CASCADE,\n            FOREIGN KEY (customer_id) REFERENCES customers (id),\n            FOREIGN KEY (reservation_id) REFERENCES reservations (id),\n            FOREIGN KEY (seat_id) REFERENCES seat_structures (id)\n        );\n    ")];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("\n        CREATE TABLE IF NOT EXISTS payments (\n            id serial PRIMARY KEY,\n            amount NUMERIC (7, 2) NOT NULL,\n            status BOOLEAN NOT NULL,\n            rejection_reason VARCHAR(32) NOT NULL,\n            transaction_no VARCHAR(16) NOT NULL,\n            create_date TIMESTAMP NOT NULL,\n            reservation_id INT NOT NULL,\n            FOREIGN KEY (reservation_id) REFERENCES reservations (id)\n        )\n    ")];
                    case 10:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateInitialTables1649277945107.prototype.down = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.query("DROP TABLE payments")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE tickets")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE customers")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE reservations")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query('DROP TYPE IF EXISTS ReservationStatus')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE seat_structures")];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE events")];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE addresses")];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE venues")];
                    case 9:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return CreateInitialTables1649277945107;
}());
exports.CreateInitialTables1649277945107 = CreateInitialTables1649277945107;
