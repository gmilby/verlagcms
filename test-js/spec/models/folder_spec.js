var folderData = {
  "_type":"Folder",
  "created_at":"2011-11-01T07:37:08Z",
  "id":"4eafa19a73c44f0862000002",
  "name":"Folder",
  "parent_id":"4eaf9f7e73c44f83b3000001",
  "site_id":"4dd8103a73c44f2dbb000001",
  "updated_at":"2011-11-01T07:37:08Z"
}

describe("Folder", function () {
  
  beforeEach(function () {
    folder = new Folder(folderData);
    Folder.add(folder);
    this.folder = Folder.first();
  });
  
  it("creates a folder from data with a name", function () {
    expect(this.folder.attr('name')).toEqual('Folder');
  });
  
  // it("returns the tags", function(){
  //   expect(Asset.tags()).toEqual(["ellen", "woman"]);
  // })
  // 
  // it("returns a JSON object of itself", function(){
  //   expect(this.asset.asJSON()).toEqual(assetData);
  // });
  // 
  // it("returns a JSON object of itself for mustache templates", function(){
  //   assetData['query_path'] = '';
  //   expect(this.asset.toMustache()).toEqual(assetData);
  // });
  // 
  it("returns a JSON object of all assets", function(){
    expect(Folder.asJSON()).toEqual([folderData]);
  });
  
});
