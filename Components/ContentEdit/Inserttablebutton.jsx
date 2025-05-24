import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { $isRangeSelection, $insertNodes } from "lexical";
import { $getSelection } from "lexical";
import { $createParagraphNode } from "lexical";
import { $createTableNodeWithDimensions } from "@lexical/table";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { MinusIcon, PlusIcon, TableIcon } from "./Icons";
export default function InsertTableButton({ activeEditor }) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState(1);
  const [columns, setColumns] = useState(1);

  const insertTable = () => {
    if (activeEditor) {
      activeEditor.dispatchCommand(INSERT_TABLE_COMMAND, {
        columns: columns,
        rows: rows,
      });
    }
    handleClose();
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const incrementRows = () => {
    if (rows >= 10) return;
    setRows(rows + 1);
    console.log(rows);
  };

  const decrementRows = () => {
    if (rows <= 1) return;
    setRows(rows - 1);
  };

  const incrementColumns = () => {
    if (columns >= 10) return;
    setColumns(columns + 1);
  };

  const decrementColumns = () => {
    if (columns <= 1) return;
    setColumns(columns - 1);
  };

  return (
    <div>
      <button onClick={handleOpen}>
        <TableIcon />
      </button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ fontFamily: "Vazir" }}>درج جدول</DialogTitle>
        <DialogContent>
          <div
            style={{ display: "flex", flexDirection: "column", width: "400px" }}
          >
            <div
              style={{
                display: "flex",
                padding: "5px 0",
                alignItems: "center",
                borderBottom: "1px solid #ddd",
              }}
            >
              <div style={{ width: "50%" }}>رديف:</div>
              <div style={{ width: "50%" }}>
                <Button sx={{ fontFamily: "Vazir" }} onClick={incrementRows}>
                  <PlusIcon />
                </Button>
                <span>{rows}</span>
                <Button sx={{ fontFamily: "Vazir" }} onClick={decrementRows}>
                  <MinusIcon />
                </Button>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                padding: "5px 0",
                alignItems: "center",
                borderBottom: "1px solid #ddd",
              }}
            >
              <div style={{ width: "50%" }}>ستون:</div>
              <div style={{ width: "50%" }}>
                <Button sx={{ fontFamily: "Vazir" }} onClick={incrementColumns}>
                  <PlusIcon />
                </Button>
                <span>{columns}</span>
                <Button sx={{ fontFamily: "Vazir" }} onClick={decrementColumns}>
                  <MinusIcon />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button sx={{ fontFamily: "Vazir" }} onClick={insertTable}>
            درج
          </Button>
          <Button sx={{ fontFamily: "Vazir" }} onClick={handleClose}>
            بستن
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
