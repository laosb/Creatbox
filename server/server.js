// it's not possible to remove all without making a method
Meteor.methods({
  addBlock: function(data,world){
      worldsArr[world].insert(data);
  },  
  destoryBlock: function(data,world){
       worldsArr[world].remove(data);
  }
  /* clearBoxes: function () {
    Boxes.remove({});
  }*/
});
