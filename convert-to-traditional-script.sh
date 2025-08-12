#!/bin/bash

# Convert Standalone Components to Separate Files (Keep Standalone)
# Run this script from your Angular project root directory

set -e  # Exit on any error

echo "🔄 Converting standalone components to separate files while keeping standalone architecture..."

# Function to extract template from component
extract_template() {
    local component_file="$1"
    local template_file="$2"
    
    # Extract template content using grep and sed
    grep -A 1000 "template: \`" "$component_file" | grep -B 1000 -m 1 "\`," | head -n -1 | tail -n +2 > "$template_file"
}

# Function to extract styles from component
extract_styles() {
    local component_file="$1"
    local styles_file="$2"
    
    # Extract styles content using grep and sed
    grep -A 1000 "styles: \[\`" "$component_file" | grep -B 1000 -m 1 "\`\]" | head -n -1 | tail -n +2 > "$styles_file"
}

# Function to update component TypeScript file (keep standalone)
update_component_ts() {
    local component_file="$1"
    local template_file="$2"
    local styles_file="$3"
    
    # Create backup
    cp "$component_file" "$component_file.backup"
    
    # Create temporary file for processing
    temp_file=$(mktemp)
    
    # Process line by line
    inside_template=false
    inside_styles=false
    component_found=false
    
    while IFS= read -r line; do
        if [[ "$line" == *"@Component({"* ]] && [[ "$component_found" == false ]]; then
            echo "@Component({"
            echo "  templateUrl: './$(basename "$template_file")',"
            echo "  styleUrls: ['./$(basename "$styles_file")'],"
            component_found=true
        elif [[ "$line" == *"template: \`"* ]]; then
            inside_template=true
        elif [[ "$line" == *"\`,"* ]] && [[ "$inside_template" == true ]]; then
            inside_template=false
        elif [[ "$line" == *"styles: [\`"* ]]; then
            inside_styles=true
        elif [[ "$line" == *"\`]"* ]] && [[ "$inside_styles" == true ]]; then
            inside_styles=false
        elif [[ "$inside_template" == false ]] && [[ "$inside_styles" == false ]]; then
            echo "$line"
        fi
    done < "$component_file.backup" > "$temp_file"
    
    # Replace original file
    mv "$temp_file" "$component_file"
    
    # Remove backup file
    rm "$component_file.backup"
}

echo "📄 Converting TraineeFilterComponent..."

# TraineeFilterComponent
FILTER_DIR="src/app/features/data/components/trainee-filter"
FILTER_TS="$FILTER_DIR/trainee-filter.component.ts"
FILTER_HTML="$FILTER_DIR/trainee-filter.component.html"
FILTER_SCSS="$FILTER_DIR/trainee-filter.component.scss"
FILTER_SPEC="$FILTER_DIR/trainee-filter.component.spec.ts"

if [ -f "$FILTER_TS" ]; then
    extract_template "$FILTER_TS" "$FILTER_HTML"
    extract_styles "$FILTER_TS" "$FILTER_SCSS"
    update_component_ts "$FILTER_TS" "$FILTER_HTML" "$FILTER_SCSS"
    
    # Create spec file
    cat > "$FILTER_SPEC" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TraineeFilterComponent } from './trainee-filter.component';

describe('TraineeFilterComponent', () => {
  let component: TraineeFilterComponent;
  let fixture: ComponentFixture<TraineeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraineeFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraineeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF
    echo "✅ TraineeFilterComponent converted"
fi

echo "📊 Converting TraineeTableComponent..."

# TraineeTableComponent
TABLE_DIR="src/app/features/data/components/trainee-table"
TABLE_TS="$TABLE_DIR/trainee-table.component.ts"
TABLE_HTML="$TABLE_DIR/trainee-table.component.html"
TABLE_SCSS="$TABLE_DIR/trainee-table.component.scss"
TABLE_SPEC="$TABLE_DIR/trainee-table.component.spec.ts"

if [ -f "$TABLE_TS" ]; then
    extract_template "$TABLE_TS" "$TABLE_HTML"
    extract_styles "$TABLE_TS" "$TABLE_SCSS"
    update_component_ts "$TABLE_TS" "$TABLE_HTML" "$TABLE_SCSS"
    
    # Create spec file
    cat > "$TABLE_SPEC" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TraineeTableComponent } from './trainee-table.component';

describe('TraineeTableComponent', () => {
  let component: TraineeTableComponent;
  let fixture: ComponentFixture<TraineeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraineeTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraineeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF
    echo "✅ TraineeTableComponent converted"
fi

echo "📋 Converting TraineeDetailComponent..."

# TraineeDetailComponent
DETAIL_DIR="src/app/features/data/components/trainee-detail"
DETAIL_TS="$DETAIL_DIR/trainee-detail.component.ts"
DETAIL_HTML="$DETAIL_DIR/trainee-detail.component.html"
DETAIL_SCSS="$DETAIL_DIR/trainee-detail.component.scss"
DETAIL_SPEC="$DETAIL_DIR/trainee-detail.component.spec.ts"

if [ -f "$DETAIL_TS" ]; then
    extract_template "$DETAIL_TS" "$DETAIL_HTML"
    extract_styles "$DETAIL_TS" "$DETAIL_SCSS"
    update_component_ts "$DETAIL_TS" "$DETAIL_HTML" "$DETAIL_SCSS"
    
    # Create spec file
    cat > "$DETAIL_SPEC" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TraineeDetailComponent } from './trainee-detail.component';

describe('TraineeDetailComponent', () => {
  let component: TraineeDetailComponent;
  let fixture: ComponentFixture<TraineeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraineeDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraineeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF
    echo "✅ TraineeDetailComponent converted"
fi

echo "📄 Converting DataPageComponent..."

# DataPageComponent
DATA_DIR="src/app/features/data/containers/data-page"
DATA_TS="$DATA_DIR/data-page.component.ts"
DATA_HTML="$DATA_DIR/data-page.component.html"
DATA_SCSS="$DATA_DIR/data-page.component.scss"
DATA_SPEC="$DATA_DIR/data-page.component.spec.ts"

if [ -f "$DATA_TS" ]; then
    extract_template "$DATA_TS" "$DATA_HTML"
    extract_styles "$DATA_TS" "$DATA_SCSS"
    update_component_ts "$DATA_TS" "$DATA_HTML" "$DATA_SCSS"
    
    # Create spec file
    cat > "$DATA_SPEC" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataPageComponent } from './data-page.component';

describe('DataPageComponent', () => {
  let component: DataPageComponent;
  let fixture: ComponentFixture<DataPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF
    echo "✅ DataPageComponent converted"
fi

echo "📊 Converting AnalysisComponent..."

# AnalysisComponent
ANALYSIS_DIR="src/app/features/analysis"
ANALYSIS_TS="$ANALYSIS_DIR/analysis.component.ts"
ANALYSIS_HTML="$ANALYSIS_DIR/analysis.component.html"
ANALYSIS_SCSS="$ANALYSIS_DIR/analysis.component.scss"
ANALYSIS_SPEC="$ANALYSIS_DIR/analysis.component.spec.ts"

if [ -f "$ANALYSIS_TS" ]; then
    extract_template "$ANALYSIS_TS" "$ANALYSIS_HTML"
    extract_styles "$ANALYSIS_TS" "$ANALYSIS_SCSS"
    update_component_ts "$ANALYSIS_TS" "$ANALYSIS_HTML" "$ANALYSIS_SCSS"
    
    # Create spec file
    cat > "$ANALYSIS_SPEC" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalysisComponent } from './analysis.component';

describe('AnalysisComponent', () => {
  let component: AnalysisComponent;
  let fixture: ComponentFixture<AnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF
    echo "✅ AnalysisComponent converted"
fi

echo "📺 Converting MonitorComponent..."

# MonitorComponent
MONITOR_DIR="src/app/features/monitor"
MONITOR_TS="$MONITOR_DIR/monitor.component.ts"
MONITOR_HTML="$MONITOR_DIR/monitor.component.html"
MONITOR_SCSS="$MONITOR_DIR/monitor.component.scss"
MONITOR_SPEC="$MONITOR_DIR/monitor.component.spec.ts"

if [ -f "$MONITOR_TS" ]; then
    extract_template "$MONITOR_TS" "$MONITOR_HTML"
    extract_styles "$MONITOR_TS" "$MONITOR_SCSS"
    update_component_ts "$MONITOR_TS" "$MONITOR_HTML" "$MONITOR_SCSS"
    
    # Create spec file
    cat > "$MONITOR_SPEC" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonitorComponent } from './monitor.component';

describe('MonitorComponent', () => {
  let component: MonitorComponent;
  let fixture: ComponentFixture<MonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF
    echo "✅ MonitorComponent converted"
fi

echo "🏠 Converting AppComponent..."

# AppComponent
APP_TS="src/app/app.component.ts"
APP_HTML="src/app/app.component.html"
APP_SCSS="src/app/app.component.scss"
APP_SPEC="src/app/app.component.spec.ts"

if [ -f "$APP_TS" ]; then
    extract_template "$APP_TS" "$APP_HTML"
    extract_styles "$APP_TS" "$APP_SCSS"
    update_component_ts "$APP_TS" "$APP_HTML" "$APP_SCSS"
    
    # Create spec file
    cat > "$APP_SPEC" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'trainee-management'`, () => {
    expect(component.title).toEqual('trainee-management');
  });
});
EOF
    echo "✅ AppComponent converted"
fi

echo ""
echo "✅ Conversion complete!"
echo ""
echo "📁 Standalone component structure with separate files created:"
echo "   • .ts files (TypeScript logic) - KEPT standalone: true"
echo "   • .html files (Templates)"
echo "   • .scss files (Styles)"
echo "   • .spec.ts files (Tests)"
echo ""
echo "🔧 Components remain standalone but now use:"
echo "   • templateUrl instead of inline template"
echo "   • styleUrls instead of inline styles"
echo ""
echo "💡 Benefits:"
echo "   • Better IDE support for HTML/CSS"
echo "   • Easier template debugging"
echo "   • Cleaner TypeScript files"
echo "   • Still standalone architecture"

echo "📄 Converting TraineeFilterComponent..."

# TraineeFilterComponent
FILTER_DIR="src/app/features/data/components/trainee-filter"
FILTER_TS="$FILTER_DIR/trainee-filter.component.ts"
FILTER_HTML="$FILTER_DIR/trainee-filter.component.html"
FILTER_SCSS="$FILTER_DIR/trainee-filter.component.scss"
FILTER_SPEC="$FILTER_DIR/trainee-filter.component.spec.ts"

if [ -f "$FILTER_TS" ]; then
    extract_template "$FILTER_TS" "$FILTER_HTML"
    extract_styles "$FILTER_TS" "$FILTER_SCSS"
    update_component_ts "$FILTER_TS" "$FILTER_HTML" "$FILTER_SCSS"
    
    # Create spec file
    cat > "$FILTER_SPEC" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TraineeFilterComponent } from './trainee-filter.component';

describe('TraineeFilterComponent', () => {
  let component: TraineeFilterComponent;
  let fixture: ComponentFixture<TraineeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TraineeFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraineeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF
    echo "✅ TraineeFilterComponent converted"
fi

echo "📊 Converting TraineeTableComponent..."

# TraineeTableComponent
TABLE_DIR="src/app/features/data/components/trainee-table"
TABLE_TS="$TABLE_DIR/trainee-table.component.ts"
TABLE_HTML="$TABLE_DIR/trainee-table.component.html"
TABLE_SCSS="$TABLE_DIR/trainee-table.component.scss"
TABLE_SPEC="$TABLE_DIR/trainee-table.component.spec.ts"

if [ -f "$TABLE_TS" ]; then
    extract_template "$TABLE_TS" "$TABLE_HTML"
    extract_styles "$TABLE_TS" "$TABLE_SCSS"
    update_component_ts "$TABLE_TS" "$TABLE_HTML" "$TABLE_SCSS"
    
    # Create spec file
    cat > "$TABLE_SPEC" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TraineeTableComponent } from './trainee-table.component';

describe('TraineeTableComponent', () => {
  let component: TraineeTableComponent;
  let fixture: ComponentFixture<TraineeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TraineeTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraineeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF
    echo "✅ TraineeTableComponent converted"
fi

echo "📋 Converting TraineeDetailComponent..."

# TraineeDetailComponent
DETAIL_DIR="src/app/features/data/components/trainee-detail"
DETAIL_TS="$DETAIL_DIR/trainee-detail.component.ts"
DETAIL_HTML="$DETAIL_DIR/trainee-detail.component.html"
DETAIL_SCSS="$DETAIL_DIR/trainee-detail.component.scss"
DETAIL_SPEC="$DETAIL_DIR/trainee-detail.component.spec.ts"

if [ -f "$DETAIL_TS" ]; then
    extract_template "$DETAIL_TS" "$DETAIL_HTML"
    extract_styles "$DETAIL_TS" "$DETAIL_SCSS"
    update_component_ts "$DETAIL_TS" "$DETAIL_HTML" "$DETAIL_SCSS"
    
    # Create spec file
    cat > "$DETAIL_SPEC" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TraineeDetailComponent } from './trainee-detail.component';

describe('TraineeDetailComponent', () => {
  let component: TraineeDetailComponent;
  let fixture: ComponentFixture<TraineeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TraineeDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraineeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF
    echo "✅ TraineeDetailComponent converted"
fi

echo "📄 Converting DataPageComponent..."

# DataPageComponent
DATA_DIR="src/app/features/data/containers/data-page"
DATA_TS="$DATA_DIR/data-page.component.ts"
DATA_HTML="$DATA_DIR/data-page.component.html"
DATA_SCSS="$DATA_DIR/data-page.component.scss"
DATA_SPEC="$DATA_DIR/data-page.component.spec.ts"

if [ -f "$DATA_TS" ]; then
    extract_template "$DATA_TS" "$DATA_HTML"
    extract_styles "$DATA_TS" "$DATA_SCSS"
    update_component_ts "$DATA_TS" "$DATA_HTML" "$DATA_SCSS"
    
    # Create spec file
    cat > "$DATA_SPEC" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataPageComponent } from './data-page.component';

describe('DataPageComponent', () => {
  let component: DataPageComponent;
  let fixture: ComponentFixture<DataPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF
    echo "✅ DataPageComponent converted"
fi

echo "📊 Converting AnalysisComponent..."

# AnalysisComponent
ANALYSIS_DIR="src/app/features/analysis"
ANALYSIS_TS="$ANALYSIS_DIR/analysis.component.ts"
ANALYSIS_HTML="$ANALYSIS_DIR/analysis.component.html"
ANALYSIS_SCSS="$ANALYSIS_DIR/analysis.component.scss"
ANALYSIS_SPEC="$ANALYSIS_DIR/analysis.component.spec.ts"

if [ -f "$ANALYSIS_TS" ]; then
    extract_template "$ANALYSIS_TS" "$ANALYSIS_HTML"
    extract_styles "$ANALYSIS_TS" "$ANALYSIS_SCSS"
    update_component_ts "$ANALYSIS_TS" "$ANALYSIS_HTML" "$ANALYSIS_SCSS"
    
    # Create spec file
    cat > "$ANALYSIS_SPEC" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalysisComponent } from './analysis.component';

describe('AnalysisComponent', () => {
  let component: AnalysisComponent;
  let fixture: ComponentFixture<AnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF
    echo "✅ AnalysisComponent converted"
fi

echo "📺 Converting MonitorComponent..."

# MonitorComponent
MONITOR_DIR="src/app/features/monitor"
MONITOR_TS="$MONITOR_DIR/monitor.component.ts"
MONITOR_HTML="$MONITOR_DIR/monitor.component.html"
MONITOR_SCSS="$MONITOR_DIR/monitor.component.scss"
MONITOR_SPEC="$MONITOR_DIR/monitor.component.spec.ts"

if [ -f "$MONITOR_TS" ]; then
    extract_template "$MONITOR_TS" "$MONITOR_HTML"
    extract_styles "$MONITOR_TS" "$MONITOR_SCSS"
    update_component_ts "$MONITOR_TS" "$MONITOR_HTML" "$MONITOR_SCSS"
    
    # Create spec file
    cat > "$MONITOR_SPEC" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonitorComponent } from './monitor.component';

describe('MonitorComponent', () => {
  let component: MonitorComponent;
  let fixture: ComponentFixture<MonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonitorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
EOF
    echo "✅ MonitorComponent converted"
fi

echo "🏠 Converting AppComponent..."

# AppComponent
APP_TS="src/app/app.component.ts"
APP_HTML="src/app/app.component.html"
APP_SCSS="src/app/app.component.scss"
APP_SPEC="src/app/app.component.spec.ts"

if [ -f "$APP_TS" ]; then
    extract_template "$APP_TS" "$APP_HTML"
    extract_styles "$APP_TS" "$APP_SCSS"
    update_component_ts "$APP_TS" "$APP_HTML" "$APP_SCSS"
    
    # Create spec file
    cat > "$APP_SPEC" << 'EOF'
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'trainee-management'`, () => {
    expect(component.title).toEqual('trainee-management');
  });
});
EOF
    echo "✅ AppComponent converted"
fi

echo ""
echo "✅ Conversion complete!"
echo ""
echo "📁 Traditional component structure created:"
echo "   • .ts files (TypeScript logic)"
echo "   • .html files (Templates)"
echo "   • .scss files (Styles)"
echo "   • .spec.ts files (Tests)"
echo ""
echo "🔧 Next steps:"
echo "1. Update imports in components to remove standalone imports"
echo "2. Create feature modules if needed"
echo "3. Update routing configuration"
echo "4. Run: ng build to verify everything works"
echo ""
echo "💡 Note: You may need to:"
echo "   • Remove 'imports' arrays from @Component decorators"
echo "   • Create NgModule files for feature modules"
echo "   • Update lazy loading configuration"
