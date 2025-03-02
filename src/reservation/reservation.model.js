const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Reservation = new Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tableId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
    }],
    reservationDate: {
      type: Date,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    customerName: {
      type: String,
    },
    customerEmail: {
      type: String,
    },
    customerPhoneNo: {
      type: String,
    },
    comments: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled","Completed"],
      default: "Pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const reservation = mongoose.model("Reservation", Reservation);
module.exports = reservation;
