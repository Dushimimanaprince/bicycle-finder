using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

namespace Assigment2
{
    public partial class ChooseForm : Form
    {
        public ChooseForm()
        {
            InitializeComponent();
        }

        private void OpenForm(Form form)
        {
            this.Hide();
            DialogResult result = form.ShowDialog();
            form.Dispose();

            if (result == DialogResult.Abort)   // user pressed Logout
            {
                this.DialogResult = DialogResult.Abort;
                this.Close();                   // goes back to Login
            }
            else
            {
                this.Show();                    // just closed the form, stay on Choose
            }
        }

        private void btnBicycle_Click(object sender, EventArgs e)
        {
            OpenForm(new BicycleRentalForm());
        }

        private void btnMushroom_Click(object sender, EventArgs e)
        {
            OpenForm(new MushroomForm());
        }

        private void label1_Click(object sender, EventArgs e)
        {

        }

        private void btnLogout_Click(object sender, EventArgs e)
        {
            this.DialogResult = DialogResult.Abort;   // tells Login we logged out
            this.Close();                             // login form shows again
        }
    }
}
