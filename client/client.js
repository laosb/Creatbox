// each color has a list so that we have a little variation
var colors = {
  normal:["#ffffff"],
  brown: ["#c2892b", "#af7c27", "#b57813"],
  red: ["#e91d45", "#e91d22", "#e60f3d"],
  green: ["#30d02c", "#26bf22", "#30c12d"],
  blue: ["#1d57e9", "#194dd1", "#1d68d9"],
  purple: ["#9414c9"],
  yellow: ["#fee619"]
};

var types = [
    {name:"normal"},
    {name:"glass"},
    {name:"box"},
    {name:"wood_plank"}
];

var worlds = [
    {name:"default",managers:[]},
    {name:"laosbscjyholy",managers:['laosb','scjyholy']},
    {name:"freedom1",managers:[]},
    {name:"freedom2",managers:[]},
    {name:"freedom3",managers:[]},
];

// set initial color
Session.set("type", "normal");
Session.set("color", "normal");
Session.set("world", "default");
// set initial mode to view
Session.set("mode", "view");

// this uses the Shark branch of Meteor, hence the UI namespace
UI.body.helpers({
  // all boxes in collection
  // XXX should at some point be scoped to user
  boxes: function () {
    return worldsArr[Session.get("world")].find();
  },
  // list of colors for color picker
  colors: function () {
    return _.map(_.keys(colors), function (name) {
      return {
        name: name,
        code: colors[name][0]
      };
    });
  },
  types: function () {
    return types;
  },
  worlds: function(){
      return worlds;
  },
  isNormal: function (type) {
    return type === "normal";
  },
  // active color helper for color picker
  activeColor: function () {
    return this.name === Session.get("color");
  },
  activeType: function () {
    return this.name === Session.get("type");
  },
  currentTypeIsNormal: function () {
      return Session.get("type") === "normal";
  },
  currentType:function(){
      return Session.get("type");
  },
  // see if we are in build mode
  buildMode: function () {
    return Session.equals("mode", "build");
  }
});

// events on the dialog with lots of buttons
UI.body.events({
  "click .clear-boxes": function () {
    Meteor.call("clearBoxes");
  },
  "click .color-swatch": function () {
    Session.set("color", this.name);
  },
  "click .type-swatch": function () {
    Session.set("type", this.name);
  },
  "click button.view-mode": function (event, template) {
    Session.set("mode", "view");
    template.find("x3d").runtime.turnTable();
  },
  "click button.build-mode": function (event, template) {
    Session.set("mode", "build");
    template.find("x3d").runtime.noNav();
  },
  "click .select-world":function (){
      $(".main-panel").fadeOut(1000);
      $(".world-select").fadeIn(1000);
  },
  "click .close-select-world":function (){
      $(".main-panel").fadeIn(1000);
      $(".world-select").fadeOut(1000);
  },
  "click .world-item":function(e){
      Session.set("world",$(e.target).attr("id"));
  },
  "mousedown shape": function (event) {
    if (Session.get("mode") === "build") {
      if (event.button === 1) {
        // left click to add box

        // calculate new box position based on location of click event
        // in 3d space and the normal of the surface that was clicked
        var x = Math.floor(event.worldX + event.normalX / 2) + 0.5,
          y = Math.floor(event.worldY + event.normalY / 2) + 0.5,
          z = Math.floor(event.worldZ + event.normalZ / 2) + 0.5;
          
        if(Session.get("type")!="normal"){
            Meteor.call('addBlock',{
                type: Session.get("type"),
                color: Session.get("color"),
                x: x,
                y: y,
                z: z
            },Session.get("world"));
        }else{
            Meteor.call('addBlock',{
                type: Session.get("type"),
                color: Random.choice(colors[Session.get("color")]),
                x: x,
                y: y,
                z: z
            },Session.get("world"));
        }
      } else if (event.button === 4 || event.button === 2) {
        // right click to remove box
        Meteor.call('destoryBlock',event.currentTarget.id,Session.get("world"));
      }
    }
  }
});
