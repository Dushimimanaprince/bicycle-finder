using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

namespace Assigment2
{
    public partial class BicycleRentalForm : Form
    {
        public BicycleRentalForm()
        {
            InitializeComponent();
        }

        private void label1_Click(object sender, EventArgs e)
        {

        }

        private void label3_Click(object sender, EventArgs e)
        {

        }

        private void BicycleRentalForm_Load(object sender, EventArgs e)
        {

        }

        private void btnCalculate_Click(object sender, EventArgs e)
        {
            int start = (int)nudStart.Value;
            int end = (int)nudEnd.Value;

            lstReceipt.Items.Clear();

            if (start >= end)
            {
                MessageBox.Show("Starting time must be less than ending time.",
                    "Invalid", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            int total = 0;
            for (int hour = start; hour < end; hour++)
            {
                int rate;
                if (hour < 7) rate = 500;
                else if (hour < 14) rate = 1000;
                else if (hour < 19) rate = 1500;
                else if (hour < 21) rate = 1000;
                else rate = 500;

                total += rate;

                // one line per hour, e.g. "7:00 - 8:00 = 1000 RWF"
                lstReceipt.Items.Add(hour + ":00 - " + (hour + 1) + ":00 = " + rate + " RWF");
            }

            txtTotal.Text = total + " RWF";
        }

        private void btnLogout_Click(object sender, EventArgs e)
        {
            this.DialogResult = DialogResult.Abort;   // tells Choose to also close
            this.Close();
        }

        private void label4_Click(object sender, EventArgs e)
        {

        }

        private void btnBack_Click(object sender, EventArgs e)
        {
            this.DialogResult = DialogResult.Cancel;   // Cancel = just go back to Choose
            this.Close();
        }
    }
}
