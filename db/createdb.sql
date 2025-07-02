CREATE TABLE IF NOT EXISTS gallery (
    id VARCHAR(50) PRIMARY KEY,
    galleryName VARCHAR(500), 
    startDateLoading VARCHAR(15),
    endDateLoading VARCHAR(15),
    timezone VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS image (
    id  INTEGER PRIMARY KEY,
    galleryId VARCHAR(50),
    url VARCHAR(1000),
    loadTime INTEGER,
    width INTEGER,
    height INTEGER,
    FOREIGN KEY(galleryId) REFERENCES gallery(id)
);

CREATE TABLE IF NOT EXISTS landingPage (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(50000),
    links TEXT
);