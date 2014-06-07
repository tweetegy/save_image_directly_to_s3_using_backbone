(function($) {

    $(document).ready(function() {

	window.defaultMyImage =
	    new MyImage({filename: 'preview.png',
			 data: 'img/preview.png',
			 bucket: 'YOUR-BUCKET!!',
			 acl: 'public-read',
			 successActionRedirect: 'http://localhost:8000/index.html',
			 contentType: 'image/',
			 folder: 'spike/',
			 AWSAccessKeyId: 'YOUR-ACCESSS-KEY!!',
			 AWSSecretKeyId: 'YOUR-SECRET-KEY!!'
			});

	window.imagePreviewView =
	    new ImagePreviewView({model: window.defaultMyImage});
	window.imageFileView =
	    new ImageFileView({model: window.defaultMyImage});

	window.App = new window.ImageRouter();
	Backbone.history.start();
    });

})(jQuery);
