import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1649277945107 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS venues (
            id serial PRIMARY KEY,
            name VARCHAR (128) NOT NULL,
            capacity INT NOT NULL
        );
    `);

    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS addresses (
            id SERIAL PRIMARY KEY,
            zip VARCHAR (6) UNIQUE NOT NULL,
            street VARCHAR (128) NOT NULL,
            city VARCHAR (32) NOT NULL,
            venue_id INT UNIQUE NOT NULL,
            FOREIGN KEY (venue_id) REFERENCES venues (id) ON DELETE CASCADE
        );
    `);

    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS events (
            id serial PRIMARY KEY,
            venue_id INT NOT NULL,
            name varchar (64) NOT NULL,
            duration SMALLINT NOT NULL,
            event_date TIMESTAMP NOT NULL,
            description varchar (256) NOT NULL,
            FOREIGN KEY (venue_id) REFERENCES venues (id) ON DELETE CASCADE
        );
    `);

    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS seat_structures (
            id serial PRIMARY KEY,
            row_no SMALLINT NOT NULL,
            column_no VARCHAR(1) NOT NULL,
            last_seat_in_row BOOLEAN NOT NULL,
            sign VARCHAR (4) NOT NULL,
            venue_id INT NOT NULL,
            FOREIGN KEY (venue_id) REFERENCES venues (id) ON DELETE CASCADE,
            UNIQUE (venue_id, sign)
        );
    `);

    await queryRunner.query(
      `CREATE TYPE ReservationStatus AS ENUM ('PENDING_PAYMENT', 'EXPIRED', 'APPROVED')`,
    );

    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS reservations (
            id serial PRIMARY KEY,
            event_id INT NOT NULL,
            status ReservationStatus NOT NULL DEFAULT 'PENDING_PAYMENT',
            booking_reference VARCHAR (16) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            deadline TIMESTAMP NOT NULL
        );
    `);

    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS customers (
            id serial PRIMARY KEY,
            firstName VARCHAR (64) NOT NULL,
            lastName VARCHAR (64) NOT NULL,
            email VARCHAR (128),
            reservation_id INT NOT NULL,
            FOREIGN KEY (reservation_id) REFERENCES reservations (id)
        );
    `);

    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS tickets (
            id serial PRIMARY KEY,
            issued BOOLEAN NOT NULL,
            ticket_number VARCHAR (32) NOT NULL,
            price NUMERIC (7, 2) NOT NULL,
            event_id INT NOT NULL,
            customer_id INT,
            reservation_id INT,
            seat_id INT NOT NULL,
            FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE,
            FOREIGN KEY (customer_id) REFERENCES customers (id),
            FOREIGN KEY (reservation_id) REFERENCES reservations (id),
            FOREIGN KEY (seat_id) REFERENCES seat_structures (id)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE tickets`);
    await queryRunner.query(`DROP TABLE customers`);
    await queryRunner.query(`DROP TABLE reservations`);
    await queryRunner.query('DROP TYPE IF EXISTS ReservationStatus');
    await queryRunner.query(`DROP TABLE seat_structures`);
    await queryRunner.query(`DROP TABLE events`);
    await queryRunner.query(`DROP TABLE addresses`);
    await queryRunner.query(`DROP TABLE venues`);
  }
}
