import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
        enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
    },
    imgURL: {
        type: String,
        required: false,
    },
    timeSlot: {
        type: String,
        required: true,
        enum: ['BREAKFAST', 'LUNCH', 'SNACKS', 'DINNER'],
    },
    name: {
        type: String,
        required: true,
    },

});

const Menu = mongoose.models.Menu || mongoose.model('Menu', MenuSchema);

export default Menu;
