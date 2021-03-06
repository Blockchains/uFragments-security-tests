'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = shouldBehaveLikeImplementationDirectory;

var _assertRevert = require('../helpers/assertRevert');

var _assertRevert2 = _interopRequireDefault(_assertRevert);

var _Ownable = require('./Ownable');

var _Ownable2 = _interopRequireDefault(_Ownable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function shouldBehaveLikeImplementationDirectory(owner, anotherAddress) {
  describe('ownership', function () {
    beforeEach(function () {
      this.ownable = this.directory;
    });

    (0, _Ownable2.default)(owner, anotherAddress);
  });

  describe('setImplementation', function () {
    const contractName = 'ERC721';

    describe('when the sender is the directory owner', function () {
      const from = owner;

      describe('when registering a contract', function () {
        beforeEach('registering the contract', async function () {
          const { logs } = await this.directory.setImplementation(contractName, this.implementation_v0, { from });

          this.logs = logs;
        });

        it('can be retrieved afterwards', async function () {
          const registeredImplementation = await this.directory.getImplementation(contractName);
          assert.equal(registeredImplementation, this.implementation_v0);
        });

        it('emits an event', async function () {
          assert.equal(this.logs.length, 1);
          assert.equal(this.logs[0].event, 'ImplementationChanged');
          assert.equal(this.logs[0].args.contractName, contractName);
          assert.equal(this.logs[0].args.implementation, this.implementation_v0);
        });

        it('allows to register another implementation of the same contract', async function () {
          await this.directory.setImplementation(contractName, this.implementation_v1, { from });

          const registeredImplementation = await this.directory.getImplementation(contractName);
          assert.equal(registeredImplementation, this.implementation_v1);
        });

        it('allows to register another contract', async function () {
          const anotherContract = 'anotherContract';
          await this.directory.setImplementation(anotherContract, this.implementation_v1, { from });

          const registeredImplementation = await this.directory.getImplementation(anotherContract);
          assert.equal(registeredImplementation, this.implementation_v1);
        });
      });

      describe('when registering an address that is not a contract', function () {
        it('reverts', async function () {
          await (0, _assertRevert2.default)(this.directory.setImplementation(contractName, anotherAddress, { from }));
        });
      });
    });

    describe('when the sender is not the directory owner', function () {
      const from = anotherAddress;

      it('cannot register contract', async function () {
        await (0, _assertRevert2.default)(this.directory.setImplementation(contractName, this.implementation_v0, { from }));
      });
    });
  });

  describe('unsetImplementation', function () {
    const ZERO_ADDRESS = 0x0;
    const contractName = 'ERC721';

    beforeEach('registering the contract', async function () {
      await this.directory.setImplementation(contractName, this.implementation_v0, { from: owner });
    });

    describe('when the sender is the directory owner', function () {
      const from = owner;

      beforeEach('unregistering the contract', async function () {
        const { logs } = await this.directory.unsetImplementation(contractName, { from });
        this.logs = logs;
      });

      it('cannot be retrieved afterwards', async function () {
        const registeredImplementation = await this.directory.getImplementation(contractName);
        assert.equal(registeredImplementation, ZERO_ADDRESS);
      });

      it('emits an event', async function () {
        assert.equal(this.logs.length, 1);
        assert.equal(this.logs[0].event, 'ImplementationChanged');
        assert.equal(this.logs[0].args.contractName, contractName);
        assert.equal(this.logs[0].args.implementation, ZERO_ADDRESS);
      });
    });

    describe('when the sender is not the directory owner', function () {
      const from = anotherAddress;

      it('cannot unregister contract', async function () {
        await (0, _assertRevert2.default)(this.directory.unsetImplementation(contractName, { from }));
      });
    });
  });
}