import React from 'react';
import { observer } from 'mobx-react-lite';
import { types } from "mobx-state-tree"
import './App.css';

// stores
const TimeModel = types
    .model({
        date: new Date(),
    })
    .actions(self => ({
      update() { self.date = new Date(); }
    }));

const ZoneModel = types
  .model({
    name: "Stockholm",
  }).actions(self => ({
    set(name) { self.name = name; }
  }));

const RootStore = types.model({
    timeModel: types.optional(TimeModel, {}),
    zoneModel: types.optional(ZoneModel, {}),
})

const store = RootStore.create({});

// the context
const MyContext = React.createContext();

// components
const TimeView = observer((props) => {
  console.log("TimeView.render()");
  const { timeModel } = React.useContext(MyContext);
  return (
    <div>
      <h2>Current time is {timeModel.date.toLocaleTimeString()}.</h2>
    </div>
  );
});

const ClockView = observer((props) => {
  console.log("ClockView.render()");
  const { zoneModel } = React.useContext(MyContext);
  return (
    <React.Fragment>
        <p>{zoneModel.name}</p>
        <TimeView />
    </React.Fragment>
  );
});

export default function App(props) {
  console.log("App.render()");
  return (
    <div className="App">
        <MyContext.Provider value={store}>
          <ClockView />
        </MyContext.Provider>
    </div>
  );
}

// some logic to modify state
function updateTime() {
  console.log("updateTime()");
  store.timeModel.update();
}

function updateZone() {
  console.log("updateZone() - ONLY ONCE !!!");
  store.zoneModel.set("London");
}

setInterval(() => updateTime(), 1000);
setTimeout(() => updateZone(), 10000);
