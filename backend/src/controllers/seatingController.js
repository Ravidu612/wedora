import SeatingTable from '../models/SeatingTable.js';
import Guest from '../models/Guest.js';

// @desc Get all seating tables with assigned guests
// @route GET /api/weddings/:id/tables
export const getTables = async (req, res, next) => {
  try {
    const tables = await SeatingTable.find({ wedding: req.params.id })
      .sort({ tableNumber: 1 })
      .populate('assignedGuests', 'name category rsvpStatus dietaryPreferences attendeesCount');

    // Also get unassigned guests count
    const totalGuests = await Guest.countDocuments({ wedding: req.params.id });
    const seatedGuests = tables.reduce((acc, t) => acc + t.assignedGuests.length, 0);

    res.status(200).json({
      success: true,
      count: tables.length,
      seatedGuests,
      unassignedGuests: Math.max(0, totalGuests - seatedGuests),
      tables,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Create a table
// @route POST /api/weddings/:id/tables
export const createTable = async (req, res, next) => {
  try {
    const { tableNumber, tableName, capacity = 10, category = 'General', tableType = 'Round', locationZone = 'Main Hall', notes = '' } = req.body;

    if (!tableNumber) {
      return res.status(400).json({ success: false, message: 'Table number is required.' });
    }

    const table = await SeatingTable.create({
      wedding: req.params.id,
      tableNumber,
      tableName: tableName || `Table ${tableNumber}`,
      capacity: Number(capacity) || 10,
      category,
      tableType,
      locationZone,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Table created successfully.',
      table,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update a table
// @route PUT /api/weddings/:id/tables/:tableId
export const updateTable = async (req, res, next) => {
  try {
    const table = await SeatingTable.findOneAndUpdate(
      { _id: req.params.tableId, wedding: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('assignedGuests', 'name category rsvpStatus');

    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Table updated successfully.',
      table,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete table
// @route DELETE /api/weddings/:id/tables/:tableId
export const deleteTable = async (req, res, next) => {
  try {
    const table = await SeatingTable.findOneAndDelete({
      _id: req.params.tableId,
      wedding: req.params.id,
    });

    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found.' });
    }

    // Reset table on all guests assigned to this table
    await Guest.updateMany(
      { wedding: req.params.id, table: table._id },
      { $unset: { table: 1 }, tableNumber: '' }
    );

    res.status(200).json({
      success: true,
      message: 'Table removed and guests unseated.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Assign guest to table
// @route POST /api/weddings/:id/tables/:tableId/assign
export const assignGuestToTable = async (req, res, next) => {
  try {
    const { guestId } = req.body;
    if (!guestId) {
      return res.status(400).json({ success: false, message: 'Guest ID is required.' });
    }

    const table = await SeatingTable.findOne({
      _id: req.params.tableId,
      wedding: req.params.id,
    });

    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found.' });
    }

    if (table.assignedGuests.length >= table.capacity) {
      return res.status(400).json({
        success: false,
        message: `Table has reached its maximum capacity of ${table.capacity} guests.`,
      });
    }

    const guest = await Guest.findOne({ _id: guestId, wedding: req.params.id });
    if (!guest) {
      return res.status(404).json({ success: false, message: 'Guest not found.' });
    }

    // If guest was already on another table, remove from it
    if (guest.table && guest.table.toString() !== table._id.toString()) {
      await SeatingTable.findByIdAndUpdate(guest.table, {
        $pull: { assignedGuests: guest._id },
      });
    }

    // Assign to new table
    await SeatingTable.findByIdAndUpdate(table._id, {
      $addToSet: { assignedGuests: guest._id },
    });

    guest.table = table._id;
    guest.tableNumber = table.tableNumber;
    await guest.save();

    res.status(200).json({
      success: true,
      message: `${guest.name} assigned to Table ${table.tableNumber}.`,
    });
  } catch (error) {
    next(error);
  }
};

