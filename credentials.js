if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const {
    NODE_ENV,
    PORT,
    POSTGRES_HOST,
    POSTGRES_USER,
    POSTGRES_DB,
    POSTGRES_PASSWORD,
    POSTGRES_PORT,
    POSTGRES_PROTOCOL,

    PRIVATE_KEY,

    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_BUCKET_NAME,
    AWS_REGION
} = process.env;

module.exports = {

    config: {
        NODE_ENV,
        PORT,
        POSTGRES_HOST,
        POSTGRES_USER,
        POSTGRES_DB,
        POSTGRES_PASSWORD,
        POSTGRES_PORT,
        POSTGRES_PROTOCOL,

        PRIVATE_KEY,

        AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY,
        AWS_BUCKET_NAME,
        AWS_REGION
    }

};

