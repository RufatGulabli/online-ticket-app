import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1649277945107 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

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
        CREATE TABLE IF NOT EXISTS concerts (
            id serial PRIMARY KEY,
            venue_id INT NOT NULL,
            name varchar (64) NOT NULL,
            duration SMALLINT NOT NULL,
            concert_date TIMESTAMP NOT NULL,
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
            FOREIGN KEY (venue_id) REFERENCES venues (id) ON DELETE CASCADE ON UPDATE CASCADE,
            UNIQUE (venue_id, sign)
        );
    `);

    await queryRunner.query(
      `CREATE TYPE ReservationStatus AS ENUM ('PENDING_PAYMENT', 'EXPIRED', 'APPROVED')`
    );

    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS reservations (
            id serial PRIMARY KEY,
            concert_id INT NOT NULL,
            status ReservationStatus NOT NULL DEFAULT 'PENDING_PAYMENT',
            booking_reference uuid NOT NULL DEFAULT uuid_generate_v4(),
            created_at TIMESTAMP NOT NULL,
            deadline TIMESTAMP NOT NULL,
            FOREIGN KEY (concert_id) REFERENCES concerts (id) ON DELETE CASCADE ON UPDATE CASCADE
        );
    `);

    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS customers (
            id serial PRIMARY KEY,
            first_name VARCHAR (64) NOT NULL,
            last_name VARCHAR (64) NOT NULL,
            email VARCHAR (128),
            seat_id INT NOT NULL,
            reservation_id INT NOT NULL,
            FOREIGN KEY (reservation_id) REFERENCES reservations (id),
            FOREIGN KEY (seat_id) REFERENCES seat_structures (id),
            UNIQUE (seat_id, reservation_id)
        );
    `);

    await queryRunner.query(
      `CREATE TYPE TicketStatus AS ENUM ('FREE', 'RESERVED', 'TICKETED')`
    );

    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS tickets (
            id serial PRIMARY KEY,
            issued TicketStatus NOT NULL DEFAULT 'FREE',
            ticket_number VARCHAR (32) NOT NULL,
            price NUMERIC (7, 2) NOT NULL,
            concert_id INT NOT NULL,
            customer_id INT,
            reservation_id INT,
            seat_id INT NOT NULL,
            FOREIGN KEY (concert_id) REFERENCES concerts (id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (customer_id) REFERENCES customers (id),
            FOREIGN KEY (reservation_id) REFERENCES reservations (id),
            FOREIGN KEY (seat_id) REFERENCES seat_structures (id)
        );
    `);

    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS payments (
            id serial PRIMARY KEY,
            amount NUMERIC (7, 2) NOT NULL,
            status BOOLEAN NOT NULL,
            rejection_reason VARCHAR(32) NOT NULL,
            transaction_no VARCHAR(16) NOT NULL,
            create_date TIMESTAMP NOT NULL,
            reservation_id INT NOT NULL,
            FOREIGN KEY (reservation_id) REFERENCES reservations (id)
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS payments`);
    await queryRunner.query(`DROP TABLE IF EXISTS tickets`);
    await queryRunner.query(`DROP TABLE IF EXISTS customers`);
    await queryRunner.query(`DROP TABLE IF EXISTS reservations`);
    await queryRunner.query(`DROP TABLE IF EXISTS seat_structures`);
    await queryRunner.query(`DROP TABLE IF EXISTS concerts`);
    await queryRunner.query(`DROP TABLE IF EXISTS addresses`);
    await queryRunner.query(`DROP TABLE IF EXISTS venues`);
    await queryRunner.query('DROP TYPE ReservationStatus');
    await queryRunner.query('DROP TYPE TicketStatus');
  }
}
