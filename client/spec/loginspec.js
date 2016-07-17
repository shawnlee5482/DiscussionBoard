describe('Login Test', function() {
	var res = null;

	beforeEach(module('login'));

	it('Should not get null value', inject(function(_loginFactory_, _$httpBackend_) {
		var loginFactory = _loginFactory_;
		var $httpBackend = _$httpBackend_;		
		var login = "test";

		$httpBackend.when('POST', '/users').respond({login: login});

		loginFactory.addUser(login, function(output) {
			res = output;
		});
		$httpBackend.flush();

		console.log('res = ', res);
		expect(res).not.toBeNull();
	}));

	it('Should return same id for the user with same login', inject(function(_loginFactory_, _$httpBackend_) {
		var loginFactory = _loginFactory_;
		var $httpBackend = _$httpBackend_;		
		var login = "test";


		$httpBackend.when('POST', '/users').respond({login: login});

		loginFactory.addUser(login, function(output) {
			res = output;
		});
		$httpBackend.flush();
		console.log('res = ', res);
		console.log('res = ', res);
		expect(res.login).toEqual("test");
	}));	

	it('if connection is bad, it should return null', inject(function(_loginFactory_, _$httpBackend_) {
		var loginFactory = _loginFactory_;
		var $httpBackend = _$httpBackend_;		
		var login = "test";
		var res = null;

		$httpBackend.when('POST', '/users').respond(500, null);


		loginFactory.addUser(login, function(output) {
			console.log('never comes here');
			res = output;
		});

		$httpBackend.flush();

		console.log('res = ', res);
		expect(res).toBeNull();
	}));	
});