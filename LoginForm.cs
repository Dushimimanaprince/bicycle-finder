using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

namespace Assigment2
{
    public partial class loginForm : Form
    {
        public loginForm()
        {
            InitializeComponent();
        }

        private void textBox1_TextChanged(object sender, EventArgs e)
        {

        }

        private void Username_Load(object sender, EventArgs e)
        {

        }

        private void label2_Click(object sender, EventArgs e)
        {

        }

        private void btnLogin_Click(object sender, EventArgs e)
        {
            if (txtUsername.Text == "prince" && txtPassword.Text == "00000")
            {
                this.Hide();
                using (var choose = new ChooseForm())
                {
                    choose.ShowDialog();   // waits here until Choose closes
                }
                txtUsername.Clear();
                txtPassword.Clear();
                this.Show();               // back to login after logout
            }
            else
            {
                MessageBox.Show("Wrong username or password!", "Login failed",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void btnExit_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void loginForm_Load(object sender, EventArgs e)
        {

        }

        private void lblTitle_Click(object sender, EventArgs e)
        {

        }
    }
}

