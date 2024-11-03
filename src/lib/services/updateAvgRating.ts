'use server';

import AvgRating from "@/lib/models/avgRating";
import Rating from "@/lib/models/rating";

const timeSlots = ["BREAKFAST", "LUNCH", "SNACKS", "DINNER"];

export default async function updateAvgRating() {
    const ratings = await Rating.find();
    let dates: string[] = [];
    for (const rating of ratings) {
        if (!dates.includes(rating.date)) dates.push(rating.date);
    }
    // create an array of avgRating objects
    let avgRatings = [];

    for (const date of dates) {
        for (const timeSlot of timeSlots) {
            const ratingsForTimeSlot = ratings.filter((rating) => rating.date === date && rating.timeSlot === timeSlot);
            const avgRating = ratingsForTimeSlot.reduce((acc, rating) => acc + rating.rating, 0) / ratingsForTimeSlot.length;
            avgRatings.push({ avgRating, numRatings: ratingsForTimeSlot.length, date, timeSlot });
        }
    }

    // delete all the avgRating objects from the database
    await AvgRating.deleteMany();

    // insert all the avgRating objects into the database
    await AvgRating.insertMany(avgRatings);


}