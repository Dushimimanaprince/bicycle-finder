namespace Assigment2
{
    partial class loginForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            label1 = new Label();
            txtUsername = new TextBox();
            label2 = new Label();
            txtPassword = new TextBox();
            btnLogin = new Button();
            btnExit = new Button();
            lblTitle = new Label();
            SuspendLayout();
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Location = new Point(59, 84);
            label1.Margin = new Padding(4, 0, 4, 0);
            label1.Name = "label1";
            label1.Size = new Size(98, 24);
            label1.TabIndex = 0;
            label1.Text = "UserName";
            // 
            // txtUsername
            // 
            txtUsername.Location = new Point(235, 76);
            txtUsername.Margin = new Padding(4, 4, 4, 4);
            txtUsername.Name = "txtUsername";
            txtUsername.Size = new Size(319, 32);
            txtUsername.TabIndex = 1;
            // 
            // label2
            // 
            label2.AutoSize = true;
            label2.Location = new Point(49, 170);
            label2.Margin = new Padding(4, 0, 4, 0);
            label2.Name = "label2";
            label2.Size = new Size(92, 24);
            label2.TabIndex = 2;
            label2.Text = "Password";
            // 
            // txtPassword
            // 
            txtPassword.Location = new Point(235, 162);
            txtPassword.Margin = new Padding(4, 4, 4, 4);
            txtPassword.Name = "txtPassword";
            txtPassword.Size = new Size(319, 32);
            txtPassword.TabIndex = 3;
            txtPassword.UseSystemPasswordChar = true;
            // 
            // btnLogin
            // 
            btnLogin.BackColor = Color.FromArgb(0, 0, 192);
            btnLogin.Location = new Point(355, 311);
            btnLogin.Margin = new Padding(4, 4, 4, 4);
            btnLogin.Name = "btnLogin";
            btnLogin.Size = new Size(131, 49);
            btnLogin.TabIndex = 4;
            btnLogin.Text = "Login";
            btnLogin.UseVisualStyleBackColor = false;
            btnLogin.Click += btnLogin_Click;
            // 
            // btnExit
            // 
            btnExit.BackColor = Color.Red;
            btnExit.Location = new Point(594, 311);
            btnExit.Name = "btnExit";
            btnExit.Size = new Size(145, 49);
            btnExit.TabIndex = 5;
            btnExit.Text = "Exit";
            btnExit.UseVisualStyleBackColor = false;
            btnExit.Click += btnExit_Click;
            // 
            // lblTitle
            // 
            lblTitle.AutoSize = true;
            lblTitle.Font = new Font("Calibri", 24F, FontStyle.Bold | FontStyle.Italic, GraphicsUnit.Point, 0);
            lblTitle.Location = new Point(155, 9);
            lblTitle.Name = "lblTitle";
            lblTitle.Size = new Size(175, 49);
            lblTitle.TabIndex = 6;
            lblTitle.Text = "Welcome";
            lblTitle.Click += lblTitle_Click;
            // 
            // loginForm
            // 
            AutoScaleDimensions = new SizeF(10F, 24F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(916, 517);
            Controls.Add(lblTitle);
            Controls.Add(btnExit);
            Controls.Add(btnLogin);
            Controls.Add(txtPassword);
            Controls.Add(label2);
            Controls.Add(txtUsername);
            Controls.Add(label1);
            Font = new Font("Calibri", 12F, FontStyle.Bold | FontStyle.Italic, GraphicsUnit.Point, 0);
            ForeColor = SystemColors.ActiveCaptionText;
            Margin = new Padding(4, 4, 4, 4);
            Name = "loginForm";
            Text = "LoginForm";
            Load += loginForm_Load;
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Label label1;
        private TextBox txtUsername;
        private Label label2;
        private TextBox txtPassword;
        private Button btnLogin;
        private Button btnExit;
        private Label lblTitle;
    }
}