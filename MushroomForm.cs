using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

namespace Assigment2
{
    public partial class MushroomForm : Form
    {
        public MushroomForm()
        {
            InitializeComponent();
        }
        private bool Ask(string question)
        {
            return MessageBox.Show(question, "Mushroom Finder",
                MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.Yes;
        }

        private void MushroomForm_Load(object sender, EventArgs e)
        {

        }

     

        private void btnLogout_Click(object sender, EventArgs e)
        {
            this.DialogResult = DialogResult.Abort;
            this.Close();
        }

        private void btnLogout_Click_1(object sender, EventArgs e)
        {
            this.DialogResult = DialogResult.Abort;
            this.Close();
        }

        private void lstMushrooms_SelectedIndexChanged(object sender, EventArgs e)
        {

        }

        private void btnStart_Click_1(object sender, EventArgs e)
        {
            string result;

            // 1st question: the teacher wants us to start here
            bool forest = Ask("Does your mushroom grow in a forest?");

            // 2nd question
            bool ring = Ask("Does your mushroom have a ring?");

            if (ring)
            {
                if (forest)
                {
                    result = "Amanite tue-mouche";
                }
                else if (Ask("Does your mushroom have a convex cup?"))
                {
                    result = "Agaric Jaunissant";
                }
                else
                {
                    result = "Coprin chevelu";
                }
            }
            else
            {
                if (!Ask("Does your mushroom have gills?"))
                {
                    result = "Cepe de Bordeaux";
                }
                else if (Ask("Does your mushroom have a convex cup?"))
                {
                    result = "Pied bleu";
                }
                else
                {
                    result = "Girolle";
                }
            }

            MessageBox.Show("Your mushroom is: " + result, "Result",
                MessageBoxButtons.OK, MessageBoxIcon.Information);
        }

        private void btnBack_Click(object sender, EventArgs e)
        {
            this.DialogResult = DialogResult.Cancel;
            this.Close();
        }
    }
}
