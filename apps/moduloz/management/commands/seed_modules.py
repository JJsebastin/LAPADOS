from django.core.management.base import BaseCommand
from apps.moduloz.models import Module, Quiz
from django.utils.text import slugify

MODULES = [
    {
        "title": "What is Doping?",
        "icon": "BAN",
        "order": 1,
        "duration_mins": 10,
        "description": "Understand what doping means, its history, and why it's banned in sports under the WADA Code.",
        "content": """
<h2>Definition of Doping</h2>
<p>Doping in sports refers to the use of <strong>prohibited substances or methods</strong> to gain an unfair competitive advantage. The term covers a wide range of practices from taking banned drugs to using blood transfusions or gene manipulation.</p>

<h2>Why is Doping Banned?</h2>
<ul>
  <li>It violates the spirit of fair play and sportsmanship</li>
  <li>Many doping substances pose <strong>serious health risks</strong>, including heart failure, liver damage, and hormonal imbalances</li>
  <li>It sets a dangerous example for younger athletes</li>
  <li>It undermines public trust in sports</li>
</ul>

<h2>The World Anti-Doping Agency (WADA)</h2>
<p>WADA was established in 1999 to coordinate and monitor the fight against doping in sport. It publishes the <strong>Prohibited List</strong> annually — a comprehensive list of substances and methods that are banned in competition, out of competition, or in specific sports.</p>

<h2>The 2021 & 2027 WADA Code Updates</h2>
<p>The 2021 WADA Code expanded the protection of whistleblowers and introduced new rules around substances of abuse. The highly anticipated <strong>2027 WADA Code</strong> introduces more robust human rights frameworks and advanced technological adaptations, specifically addressing gene editing and enhanced data privacy.</p>

<h2>The Three Criteria for Prohibition</h2>
<p>A substance or method is added to the Prohibited List if it meets <em>two of the following three</em> criteria:</p>
<ol>
  <li>It has the potential to enhance sport performance</li>
  <li>It represents a real or potential health risk to the athlete</li>
  <li>It violates the spirit of sport</li>
</ol>

<blockquote style="border-left:4px solid #E63946;padding-left:1rem;margin:1rem 0;color:#9ca3af">
"Athletes are responsible for any substance found in their bodies — whether taken knowingly or not."
— WADA World Anti-Doping Code
</blockquote>
""",
        "quizzes": [
            {
                "question": "When was the World Anti-Doping Agency (WADA) established?",
                "option_a": "1984",
                "option_b": "1999",
                "option_c": "2004",
                "option_d": "1972",
                "correct": "B",
                "explanation": "WADA was founded in 1999 in response to the Tour de France doping scandal of 1998."
            },
            {
                "question": "How many of WADA's three criteria must a substance meet to be added to the Prohibited List?",
                "option_a": "All three",
                "option_b": "At least one",
                "option_c": "At least two",
                "option_d": "Exactly three",
                "correct": "C",
                "explanation": "A substance needs to satisfy at least TWO of the three criteria to be prohibited."
            },
            {
                "question": "What key expansion is expected in the 2027 WADA Code compared to the 2021 code?",
                "option_a": "Removal of out-of-competition testing",
                "option_b": "Decreased focus on data privacy",
                "option_c": "Introduction of robust human rights frameworks and gene editing rules",
                "option_d": "Elimination of the ABP system",
                "correct": "C",
                "explanation": "The 2027 WADA Code introduces more robust human rights frameworks and technological rules."
            },
        ]
    },
    {
        "title": "The WADA Prohibited List",
        "icon": "LIST",
        "order": 2,
        "duration_mins": 15,
        "description": "Explore the categories of banned substances and methods athletes must avoid.",
        "content": """
<h2>Understanding the Prohibited List</h2>
<p>The WADA Prohibited List is updated every year on <strong>January 1st</strong>. It categorizes prohibited substances and methods into three sections:</p>

<h2>Section S — Prohibited Substances</h2>
<ul>
  <li><strong>S0 — Non-approved substances:</strong> Any pharmacological substance not approved for human therapeutic use</li>
  <li><strong>S1 — Anabolic Agents:</strong> Anabolic steroids (e.g., testosterone, stanozolol), SARMs</li>
  <li><strong>S2 — Peptide Hormones:</strong> EPO, HGH, IGF-1, insulin</li>
  <li><strong>S3 — Beta-2 Agonists:</strong> High doses of salbutamol, formoterol (asthma medications)</li>
  <li><strong>S4 — Hormone Modulators:</strong> Aromatase inhibitors, SERMs, anti-estrogens</li>
  <li><strong>S5 — Diuretics & Masking Agents:</strong> Substances that alter urine composition</li>
  <li><strong>S6 — Stimulants:</strong> Amphetamine, cocaine, ephedrine (in competition only)</li>
  <li><strong>S7 — Narcotics:</strong> Morphine, oxycodone (in competition only)</li>
  <li><strong>S8 — Cannabinoids:</strong> Cannabis, synthetic cannabinoids (in competition only)</li>
  <li><strong>S9 — Glucocorticoids:</strong> All routes except topical skin, eye, ear (in competition only)</li>
</ul>

<h2>Section M — Prohibited Methods</h2>
<ul>
  <li><strong>M1 — Blood Manipulation:</strong> Blood transfusions, artificial oxygen carriers</li>
  <li><strong>M2 — Chemical & Physical Manipulation:</strong> Urine substitution, IV infusions &gt;100 mL</li>
  <li><strong>M3 — Gene Doping:</strong> Gene editing to enhance performance</li>
</ul>

<h2>Section P — Prohibited in Specific Sports</h2>
<p>Beta-blockers are prohibited in archery, golf, and shooting where a steadier hand provides competitive advantage.</p>

<div style="background:#1f2937;border-radius:0.75rem;padding:1rem;margin-top:1rem">
  <strong style="color:#E63946">💡 Important:</strong> Some substances are only banned IN-COMPETITION, while others are banned year-round (out-of-competition too).
</div>
""",
        "quizzes": [
            {
                "question": "When is the WADA Prohibited List updated?",
                "option_a": "Every 5 years",
                "option_b": "Every January 1st",
                "option_c": "Every Olympic year",
                "option_d": "Whenever needed",
                "correct": "B",
                "explanation": "The Prohibited List is reviewed and updated annually, effective January 1st each year."
            },
            {
                "question": "EPO (Erythropoietin) falls under which WADA category?",
                "option_a": "S1 — Anabolic Agents",
                "option_b": "S3 — Beta-2 Agonists",
                "option_c": "S2 — Peptide Hormones",
                "option_d": "M1 — Blood Manipulation",
                "correct": "C",
                "explanation": "EPO is a peptide hormone classified under S2 on the WADA Prohibited List."
            },
            {
                "question": "Which substance is ONLY prohibited in specific sports like archery and shooting?",
                "option_a": "Anabolic steroids",
                "option_b": "Beta-blockers",
                "option_c": "Cannabis",
                "option_d": "HGH",
                "correct": "B",
                "explanation": "Beta-blockers reduce tremors and heart rate, giving an unfair advantage in precision sports."
            },
        ]
    },
    {
        "title": "The Athlete Biological Passport (ABP) 2022 Updates",
        "icon": "LAB",
        "order": 3,
        "duration_mins": 12,
        "description": "Discover the advanced tracking of athlete biological markers and 2022 ISRM updates.",
        "content": """
<h2>What is the ABP?</h2>
<p>The ABP is a digital record of an athlete's biological markers over time. Instead of testing for specific substances, it monitors the <em>effects</em> of doping on the body. The ABP has led to numerous suspensions and is used as standalone evidence without requiring direct detection of a substance.</p>

<h2>ABP Modules (Updated 2022)</h2>
<p>The 2022 International Standard for Results Management (ISRM) provided critical redline updates to the ABP framework, strengthening the statistical models used to flag anomalies:</p>
<ul>
  <li><strong>Haematological Module:</strong> Tracks red blood cell parameters to detect blood doping and EPO use. The 2022 updates refined the adaptive model for more accurate flagging.</li>
  <li><strong>Steroidal Module:</strong> Monitors steroid levels and endogenous steroid profiles in urine.</li>
  <li><strong>Endocrine Module:</strong> Evaluates markers of growth hormone (GH) doping.</li>
</ul>

<h2>The Review Process</h2>
<p>If an atypical passport finding (ATPF) is triggered, it is reviewed by an independent panel of three experts. Under the 2022 updates, athletes are given an opportunity to provide medical explanations for the variations before an ADRV is asserted.</p>
""",
        "quizzes": [
            {
                "question": "What does ABP stand for?",
                "option_a": "Anti-Banned Products",
                "option_b": "Athlete Biological Passport",
                "option_c": "Athlete Blood Panel",
                "option_d": "Annual Biological Profile",
                "correct": "B",
                "explanation": "The Athlete Biological Passport monitors biological markers over time to detect the effects of doping."
            },
            {
                "question": "Which ABP module is designed to detect blood doping and EPO use?",
                "option_a": "Steroidal Module",
                "option_b": "Haematological Module",
                "option_c": "Endocrine Module",
                "option_d": "Metabolic Module",
                "correct": "B",
                "explanation": "The Haematological Module tracks red blood cell parameters to identify abnormal patterns from blood doping."
            },
            {
                "question": "What happens if an atypical passport finding (ATPF) is triggered according to the 2022 ISRM updates?",
                "option_a": "The athlete receives a lifetime ban instantly.",
                "option_b": "The athlete's medals are immediately stripped.",
                "option_c": "It is reviewed by a panel of 3 experts and the athlete can provide a medical explanation.",
                "option_d": "The finding is ignored if it's the first time.",
                "correct": "C",
                "explanation": "The 2022 updates require expert review and allow the athlete to provide medical explanations before an ADRV is declared."
            },
        ]
    },
    {
        "title": "Compliance & The ISCCS Framework",
        "icon": "LAW",
        "order": 4,
        "duration_mins": 10,
        "description": "Learn about the International Standard for Code Compliance by Signatories.",
        "content": """
<h2>What is the ISCCS?</h2>
<p>The International Standard for Code Compliance by Signatories (ISCCS) is the framework WADA uses to ensure all anti-doping organizations globally enforce the WADA code correctly.</p>

<h2>Signatory Obligations</h2>
<ul>
  <li><strong>Implementing the Code:</strong> Signatories must draft anti-doping rules that conform strictly to the WADA Code.</li>
  <li><strong>Testing and Investigations:</strong> They must conduct robust testing and investigations.</li>
  <li><strong>TUE Management:</strong> Signatories must have a process for granting Therapeutic Use Exemptions (TUEs).</li>
  <li><strong>Education:</strong> They are required to provide anti-doping education to their athletes.</li>
</ul>

<h2>Consequences of Non-Compliance</h2>
<p>If a signatory (like a National Anti-Doping Organization) is declared non-compliant under the ISCCS:</p>
<ul>
  <li>Their athletes may be barred from competing under their national flag at the Olympic Games.</li>
  <li>The country may lose the right to host major international sporting events.</li>
  <li>WADA funding and privileges are suspended.</li>
</ul>

<div style="background:#1f2937;border-radius:0.75rem;padding:1rem;margin-top:1rem">
  <strong style="color:#E63946">💡 Insight:</strong> The ISCCS ensures that anti-doping is a global effort and no country can ignore the rules without severe international sporting consequences.
</div>
""",
        "quizzes": [
            {
                "question": "What is the primary purpose of the ISCCS?",
                "option_a": "To list prohibited substances.",
                "option_b": "To ensure signatories globally enforce the WADA code correctly.",
                "option_c": "To ban athletes permanently.",
                "option_d": "To issue Therapeutic Use Exemptions.",
                "correct": "B",
                "explanation": "The ISCCS stands for International Standard for Code Compliance by Signatories and ensures global enforcement of the WADA Code."
            },
            {
                "question": "Which of the following is a potential consequence if a country is found non-compliant under the ISCCS?",
                "option_a": "The country's athletes may be barred from competing under their flag.",
                "option_b": "The country receives an automatic $10 million fine.",
                "option_c": "The country's government must resign.",
                "option_d": "Nothing happens, compliance is voluntary.",
                "correct": "A",
                "explanation": "Non-compliance under ISCCS can lead to severe sporting consequences, including athletes not being allowed to represent their flag at the Olympics."
            },
            {
                "question": "Which is NOT an obligation of a Signatory under the ISCCS?",
                "option_a": "Implementing the Code in their rules.",
                "option_b": "Providing anti-doping education to athletes.",
                "option_c": "Paying athlete salaries directly.",
                "option_d": "Conducting testing and investigations.",
                "correct": "C",
                "explanation": "Signatories are responsible for anti-doping rules, testing, TUEs, and education. Paying salaries is not their role."
            },
        ]
    },
]

class Command(BaseCommand):
    help = "Seed the database with anti-doping learning modules and quizzes"

    def handle(self, *args, **kwargs):
        created = 0
        skipped = 0
        for data in MODULES:
            quizzes = data.pop("quizzes")
            slug = slugify(data["title"])
            module, was_created = Module.objects.get_or_create(
                slug=slug,
                defaults=data
            )
            if was_created:
                created += 1
                self.stdout.write(f"  [CREATED] {module.title}")
                for q in quizzes:
                    Quiz.objects.create(module=module, **q)
                    self.stdout.write(f"    [QUIZ] Added question")
            else:
                skipped += 1
                self.stdout.write(f"  [SKIPPED] {module.title}")
                # Update existing content
                module.content = data["content"]
                module.description = data["description"]
                module.duration_mins = data["duration_mins"]
                module.save()
                
                # Delete old quizzes and add new ones
                module.quizzes.all().delete()
                for q in quizzes:
                    Quiz.objects.create(module=module, **q)
                    self.stdout.write(f"    [QUIZ] Replaced question")

            data["quizzes"] = quizzes  # restore for safety

        self.stdout.write(self.style.SUCCESS(
            f"\\nDone! Created {created} modules, updated {skipped}."
        ))
