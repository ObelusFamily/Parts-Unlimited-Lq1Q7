require("dotenv").config();
const mongoose = require('mongoose');
require("../models");
const User = require("../models/User");
const Item = require("../models/Item");

const data = require("./seed-data.json");

// Seeds the DB with 3 users and 2 items.

async function main() {
    console.log('>> starting seeding the DB')
    const usersData = data["users"]
    if (!usersData) {
        throw new Error("missing users data, aborting migration");
    }

    for (const user of usersData) {

        if (await User.exists({ _id: user._id })) {
            throw new Error(
                `User "${user._id}" already exists in the system, aborting migration...`
            );
        }

        const id = mongoose.Types.ObjectId();
        console.log('>>>> object id is:', id)

        const dbUser = new User(user);
        await dbUser.save()
        console.log(`Created user ${dbUser._id} with username ${dbUser.username}`);
    }

    const itemsData = data["items"]
    if (!itemsData) {
        throw new Error("missing items data, aborting migration");
    }

    for (const item of itemsData) {

        if (await Item.exists({ _id: item._id })) {
            throw new Error(
                `Item "${item._id}" already exists in the system, aborting migration...`
            );
        }

        const itemUser = await User.findById(item.seller)
        if (!itemUser) {
            throw new Error(
                `User with id ${item.seller} does not exist in DB, aborting migration`
            )
        }
        item.seller = itemUser
        const dbItem = new Item(item)
        await dbItem.save()
        console.log(`Created item ${dbItem._id} with title ${dbItem.title}`);
    }
}

main()
    .then(() => {
        console.log("Finished DB seeding");
        process.exit(0);
    })
    .catch((err) => {
        console.log(`Error while running DB seed: ${err.message}`);
        process.exit(1);
    });
