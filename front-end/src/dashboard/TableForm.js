import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today } from "../utils/date-time";

export default function NewTableForm() {
  const history = useHistory();

  const initialtableInfo = {
    table_name: "",
    capacity: 0,
    status: false,
  };
  const [errors, setErrors] = useState([]);

  const [tableInfo, settableInfo] = useState({
    ...initialtableInfo,
  });

  const submitHandler = async (event) => {
    event.preventDefault();
    if (checkTableReqs() !== false) {
      await createTable(tableInfo).then((res) =>
        history.push(`/dashboard?date=${today()}`)
      );
    }
  };

  const nameHandler = ({ target }) => {
    settableInfo({
      ...tableInfo,
      [target.name]: target.value,
    });
  };
  const capacityHandler = ({ target }) => {
    settableInfo({
      ...tableInfo,
      [target.name]: Number(target.value),
    });
  };

  const cancelHandler = async (event) => {
    event.preventDefault();
    settableInfo({ ...initialtableInfo });
    history.goBack();
  };

  const checkTableReqs = async () => {
    const foundErrors = [];
    if (tableInfo.table_name.length < 2) {
      foundErrors.push({
        message: "Error: table name must be at least two characters long.",
      });
    }
    if (tableInfo.capacity < 1) {
      foundErrors.push({
        message: "Error: table must hold at least one person.",
      });
    }

    setErrors(foundErrors);
    return errors.length === 0;
  };

  const errorList = () => {
    return errors.map((err, index) => <ErrorAlert key={index} error={err} />);
  };

  return (
    <div className="container pl-0">
      <div className="dashboard-title">
        <h1 style={{textAlign: 'center', marginTop: 10, WebkitTextFillColor: 'darkgray'}}>Add / Edit Table</h1>
      </div>

      <hr className="page-title-separator" />

      <div className="row justify-content-center align-items-center h-100 px-5">
        <div className="col col-sm-12 col-md-6 col-lg-4 col-xl-4">
          <form>
            {errorList()}
            <div className="form-group">
              <label>Table Name:</label>
              <input
                value={tableInfo.table_name}
                className="form-control"
                onChange={nameHandler}
                id="table_name"
                placeholder="Table Name"
                type="text"
                name="table_name"
                required
              />
              <label>Capacity</label>
              <input
                value={tableInfo.capacity}
                onChange={capacityHandler}
                className="form-control mb-2"
                id="capacity"
                placeholder="Capacity"
                type="number"
                name="capacity"
                required
              />
              <button type="submit" onClick={submitHandler}>
                Submit
              </button>
              <button type="cancel" onClick={cancelHandler}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}