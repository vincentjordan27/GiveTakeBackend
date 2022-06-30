const ClientError = require('../../exceptions/ClientError');

class MailHandler {
  constructor(usersService, mailSender) {
    this._usersService = usersService;
    this._mailSender = mailSender;

    this.postResetPhoneHandler = this.postResetPhoneHandler.bind(this);
    this.postResetPasswordHandler = this.postResetPasswordHandler.bind(this);
    this.postAdminOtpHandler = this.postAdminOtpHandler.bind(this);
  }

  async postAdminOtpHandler(request, h) {
    try {
      const { code, email } = request.payload;

      const type = 'Kode verifikasi untuk login admin.';
      const content = `Kode OTP untuk masuk sebagai admin adalah 
      
      ${code}
      
      Terimakasih.`;
      const result = await this._mailSender.sendMail(email, type, content);

      console.log(result);
      return h.response({
        status: 'success',
        message: 'Berhasil mengirim kode ke email',
      });
    } catch (error) {
      console.log(error);
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async postResetPhoneHandler(request, h) {
    try {
      const { id } = request.auth.credentials;

      const { code } = request.payload;

      const email = await this._usersService.getEmailUser(id);
      console.log(email);
      const type = 'Kode verifikasi reset nomor telepon.';
      const content = `Kode verifikasi Anda untuk mengatur ulang nomor telepon adalah 
      
      ${code}
      
      Terimakasih.`;
      const result = await this._mailSender.sendMail(email, type, content);

      console.log(result);
      return h.response({
        status: 'success',
        message: 'Berhasil mengirim kode ke email',
      });
    } catch (error) {
      console.log(error);
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async postResetPasswordHandler(request, h) {
    try {
      const { username } = request.params;

      const { code } = request.payload;

      const email = await this._usersService.getEmailBasedUsername(username);
      console.log(email);
      const type = 'Kode verifikasi reset password.';
      const content = `Kode verifikasi Anda untuk mengatur ulang password adalah 
      
      ${code}
      
      Terimakasih.`;
      const result = await this._mailSender.sendMail(email, type, content);

      console.log(result);
      return h.response({
        status: 'success',
        message: 'Berhasil mengirim kode ke email',
      });
    } catch (error) {
      console.log(error);
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = MailHandler;
