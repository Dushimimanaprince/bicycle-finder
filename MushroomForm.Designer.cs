namespace Assigment2
{
    partial class MushroomForm
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
            btnLogout = new Button();
            label1 = new Label();
            lblInstruction = new Label();
            btnBack = new Button();
            listBox1 = new ListBox();
            btnStart = new Button();
            SuspendLayout();
            // 
            // btnLogout
            // 
            btnLogout.BackColor = Color.Red;
            btnLogout.ForeColor = Color.White;
            btnLogout.Location = new Point(662, 370);
            btnLogout.Name = "btnLogout";
            btnLogout.Size = new Size(139, 50);
            btnLogout.TabIndex = 1;
            btnLogout.Text = "Logout";
            btnLogout.UseVisualStyleBackColor = false;
            btnLogout.Click += btnLogout_Click_1;
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.ForeColor = Color.Black;
            label1.Location = new Point(325, 32);
            label1.Name = "label1";
            label1.Size = new Size(245, 24);
            label1.TabIndex = 2;
            label1.Text = " Mushroom guessing Finder";
            // 
            // lblInstruction
            // 
            lblInstruction.AutoSize = true;
            lblInstruction.ForeColor = Color.Black;
            lblInstruction.Location = new Point(256, 84);
            lblInstruction.Name = "lblInstruction";
            lblInstruction.Size = new Size(361, 24);
            lblInstruction.TabIndex = 3;
            lblInstruction.Text = "Think of one mushroom, then press Start.";
            // 
            // btnBack
            // 
            btnBack.BackColor = Color.FromArgb(31, 58, 95);
            btnBack.ForeColor = Color.White;
            btnBack.Location = new Point(96, 370);
            btnBack.Name = "btnBack";
            btnBack.Size = new Size(139, 50);
            btnBack.TabIndex = 5;
            btnBack.Text = "Back";
            btnBack.UseVisualStyleBackColor = false;
            btnBack.Click += btnBack_Click;
            // 
            // listBox1
            // 
            listBox1.FormattingEnabled = true;
            listBox1.Items.AddRange(new object[] { "Agaric Jaunissant", "Amanite tue-mouche", "Cepe de Bordeaux", "Coprin chevelu", "Girolle", "Pied bleu" });
            listBox1.Location = new Point(209, 130);
            listBox1.Name = "listBox1";
            listBox1.SelectionMode = SelectionMode.None;
            listBox1.Size = new Size(433, 124);
            listBox1.TabIndex = 6;
            // 
            // btnStart
            // 
            btnStart.BackColor = Color.SteelBlue;
            btnStart.Location = new Point(368, 299);
            btnStart.Name = "btnStart";
            btnStart.Size = new Size(139, 50);
            btnStart.TabIndex = 7;
            btnStart.Text = " Start ";
            btnStart.UseVisualStyleBackColor = false;
            btnStart.Click += btnStart_Click_1;
            // 
            // MushroomForm
            // 
            AutoScaleDimensions = new SizeF(10F, 24F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(1000, 540);
            Controls.Add(btnStart);
            Controls.Add(listBox1);
            Controls.Add(btnBack);
            Controls.Add(lblInstruction);
            Controls.Add(label1);
            Controls.Add(btnLogout);
            Font = new Font("Calibri", 12F, FontStyle.Bold | FontStyle.Italic, GraphicsUnit.Point, 0);
            ForeColor = Color.White;
            Margin = new Padding(4);
            Name = "MushroomForm";
            Text = "MushroomForm";
            Load += MushroomForm_Load;
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion
        private Button btnLogout;
        private Label label1;
        private Label lblInstruction;
        private Button btnBack;
        private ListBox listBox1;
        private Button btnStart;
    }
}