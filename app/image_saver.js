$(document).ready(function() {

    window.MyImage = Backbone.Model.extend({
	setFromFile: function(file) {
	    var reader = new FileReader();
	    self = this;

	    // Closure to capture the file information.
	    reader.onload = (function(f) {
		return function(e) {
		    self.set({filename: f.name})
		    self.set({data: e.target.result});
		    self.updatePolicy();
		};
	    })(file);

	    // Read in the image file as a data URL.
	    reader.readAsDataURL(file);
	},

	initialize: function(){
	    this.updatePolicy();
	},

	updatePolicy: function(){
	    var key = this.get('folder') + this.get('filename');
	    this.set({key: key});

	    POLICY_JSON = { "expiration": "2012-12-01T12:00:00.000Z",
			    "conditions": [
				["eq", "$bucket", this.get('bucket')],
				["starts-with", "$key", this.get('key')],
				{"acl": this.get('acl')},
				{"success_action_redirect": this.get('successActionRedirect')},
				{"x-amz-meta-filename": this.get('filename')},
				["starts-with", "$Content-Type", this.get('contentType')]
			    ]
			  };

	    var secret = this.get('AWSSecretKeyId');
	    var policyBase64 = Base64.encode(JSON.stringify(POLICY_JSON));
	    var signature = b64_hmac_sha1(secret, policyBase64);
	    
	    this.set({POLICY: policyBase64 });
	    this.set({SIGNATURE: signature });	  
	}

    });

    window.ImageFileView = Backbone.View.extend({
	events: {
	    'change #myImage': 'dispatchUpdatePreview'
	},

	template: _.template($("#image-file-template").html()),

	initialize: function() {
	    _.bindAll(this, 'render');
	},

	render: function() {
	    $(this.el).html(this.template(this.model.toJSON()));
	    metaView = new ImageMetaView({model: window.defaultMyImage});
	    $formBlob = this.$("#formBlob");
	    $formBlob.prepend(metaView.render().el);
	    return this;
	},

	dispatchUpdatePreview: function(e) {
	    //In production we would really dispatch an event
	    //but instead, for the demo, call model function directly
	    this.model.setFromFile(e.target.files[0]);
	}
    });

    window.ImageMetaView = Backbone.View.extend({
	template: _.template($("#image-meta-template").html()),

	initialize: function() {
	    _.bindAll(this, 'render');
	    this.model.bind("change", this.render);
	},

	render: function() {
	    $(this.el).html(this.template(this.model.toJSON()));
	    return this;
	},
    });

    window.ImagePreviewView = Backbone.View.extend({
	template: _.template($("#image-preview-template").html()),

	initialize: function() {
	    _.bindAll(this, 'render');
	    this.model.bind('change', this.render);
	},

	render: function(){
	    $(this.el).html(this.template(this.model.toJSON()));
	    return this;
	}
    });

    window.ImageRouter = Backbone.Router.extend({
	routes: {
	    '': 'home'
	},

	home: function(){
	    $('#container').empty();     
 	    $('#container').append(window.imagePreviewView.render().el);  
	    $('#container').append(window.imageFileView.render().el);  
	}
    });

});